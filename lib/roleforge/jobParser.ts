/**
 * ASISH: THE ENGINEERING FRONTIER — FRONTIER ROLEFORGE
 * Deterministic Job Brief Compiler & Privacy-First Text Parser
 *
 * Extracts technical requirements from unstructured job descriptions,
 * classifies priority, detects negations, and preserves supporting text spans.
 */

import { CANONICAL_SKILL_TAXONOMY } from "./skillTaxonomy";
import type { CanonicalSkill, RequirementPriority, RoleRequirement, SkillCategory } from "./types";

export interface ParsedRequirementCandidate {
  skill: CanonicalSkill;
  originalTextSpan: string;
  priority: RequirementPriority;
  importance: number;
  confidence: "HIGH" | "MEDIUM" | "AMBIGUOUS";
}

const MAX_INPUT_LENGTH = 50_000;

export function sanitizeJobDescriptionText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return "";

  // Truncate to safety limit
  let text = rawText.slice(0, MAX_INPUT_LENGTH);

  // Strip dangerous HTML/script tags to prevent XSS
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");

  // Normalize Unicode spaces and linebreaks
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");

  return text.trim();
}

/**
 * Checks whether a mention of a keyword is negated in the immediate context.
 * e.g. "no Java required", "not looking for Python", "without requiring React"
 */
function isNegatedContext(sentence: string, keyword: string): boolean {
  const lowerSentence = sentence.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  const negationPatterns = [
    new RegExp(`\\b(?:no|not|neither|nor|without|never)\\b[^.]{0,30}\\b${lowerKeyword}\\b`, "i"),
    new RegExp(`\\b${lowerKeyword}\\b[^.]{0,20}\\b(?:not required|is not needed|isn't required)\\b`, "i"),
  ];

  return negationPatterns.some((pattern) => pattern.test(lowerSentence));
}

/**
 * Detects whether sentence context signals a mandatory, preferred, or optional requirement.
 */
function detectPriorityFromContext(sentence: string): RequirementPriority {
  const lower = sentence.toLowerCase();

  if (
    /\b(?:required|must have|mandatory|essential|minimum of|strong proficiency|proven experience in|core requirement)\b/i.test(
      lower
    )
  ) {
    return "REQUIRED";
  }

  if (/\b(?:preferred|nice to have|plus|bonus|beneficial|advantageous|ideally|good to have)\b/i.test(lower)) {
    return "PREFERRED";
  }

  if (/\b(?:optional|familiarity with|exposure to|awareness of)\b/i.test(lower)) {
    return "OPTIONAL";
  }

  return "REQUIRED"; // Default to required if listed in requirements section
}

/**
 * Computes estimated importance (1 to 5) based on mention frequency, priority, and role relevance.
 */
function computeImportance(priority: RequirementPriority, mentionCount: number): number {
  let base = priority === "REQUIRED" ? 4 : priority === "PREFERRED" ? 3 : 2;
  if (mentionCount > 1) base += 1;
  return Math.min(5, Math.max(1, base));
}

/**
 * Parses raw job description into canonical requirement candidates.
 */
export function parseJobDescription(rawText: string): ParsedRequirementCandidate[] {
  const sanitized = sanitizeJobDescriptionText(rawText);
  if (!sanitized || sanitized.length < 10) return [];

  // Split into sentences and bullet points
  const rawSegments = sanitized
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const matchedSkillsMap = new Map<
    string,
    {
      skill: CanonicalSkill;
      originalSpans: string[];
      priorities: RequirementPriority[];
      mentionCount: number;
    }
  >();

  for (const segment of rawSegments) {
    const lowerSegment = segment.toLowerCase();

    for (const skill of CANONICAL_SKILL_TAXONOMY) {
      // 1. Check aliases and keywords
      const searchTerms = [skill.name, ...skill.aliases];

      let matchedTerm: string | null = null;
      for (const term of searchTerms) {
        // Word boundary match
        const regex = new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        if (regex.test(segment)) {
          matchedTerm = term;
          break;
        }
      }

      if (!matchedTerm) continue;

      // 2. Disambiguation check
      if (skill.disambiguation) {
        let isAmbiguous = false;
        for (const dis of skill.disambiguation) {
          const confusedRegex = new RegExp(`\\b${dis.confusedWith.toLowerCase()}\\b`, "i");
          if (confusedRegex.test(lowerSegment)) {
            // Check if context specifically clarifies or conflates
            if (skill.id === "lang-javascript" && /\bjava\b/i.test(lowerSegment) && !/\bscript\b/i.test(lowerSegment)) {
              isAmbiguous = true;
            }
            if (skill.id === "fe-react-nextjs" && /\breactive\b/i.test(lowerSegment) && !/\breact\b/i.test(lowerSegment)) {
              isAmbiguous = true;
            }
          }
        }
        if (isAmbiguous) continue;
      }

      // 3. Negation check
      if (isNegatedContext(segment, matchedTerm)) {
        continue;
      }

      // 4. Register match
      const priority = detectPriorityFromContext(segment);
      const existing = matchedSkillsMap.get(skill.id);
      if (existing) {
        existing.mentionCount += 1;
        existing.priorities.push(priority);
        if (existing.originalSpans.length < 3) {
          existing.originalSpans.push(segment);
        }
      } else {
        matchedSkillsMap.set(skill.id, {
          skill,
          originalSpans: [segment],
          priorities: [priority],
          mentionCount: 1,
        });
      }
    }
  }

  // Convert to candidate array
  const candidates: ParsedRequirementCandidate[] = [];
  for (const entry of matchedSkillsMap.values()) {
    const isAnyRequired = entry.priorities.includes("REQUIRED");
    const resolvedPriority: RequirementPriority = isAnyRequired
      ? "REQUIRED"
      : entry.priorities.includes("PREFERRED")
      ? "PREFERRED"
      : "OPTIONAL";

    const importance = computeImportance(resolvedPriority, entry.mentionCount);

    candidates.push({
      skill: entry.skill,
      originalTextSpan: entry.originalSpans[0] || entry.skill.name,
      priority: resolvedPriority,
      importance,
      confidence: entry.mentionCount > 1 || isAnyRequired ? "HIGH" : "MEDIUM",
    });
  }

  // Sort candidates: REQUIRED first, then by importance descending
  candidates.sort((a, b) => {
    if (a.priority === "REQUIRED" && b.priority !== "REQUIRED") return -1;
    if (a.priority !== "REQUIRED" && b.priority === "REQUIRED") return 1;
    return b.importance - a.importance;
  });

  return candidates;
}

