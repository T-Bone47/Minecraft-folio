import test from "node:test";
import assert from "node:assert/strict";
import { resolveSiteConfig } from "../lib/siteOrigin";

test("a production build needs an explicit origin before indexing", () => {
  assert.deepEqual(resolveSiteConfig({ NODE_ENV: "production" }), {
    productionOrigin: undefined,
    indexable: false,
    metadataBase: "http://localhost:3000",
  });
  const deployment = resolveSiteConfig({ NODE_ENV: "production", VERCEL_ENV: "production", VERCEL_URL: "portfolio-generated.vercel.app" });
  assert.equal(deployment.indexable, false);
  assert.equal(deployment.productionOrigin, undefined);
  assert.equal(deployment.metadataBase, "https://portfolio-generated.vercel.app");
});

test("a configured production origin is normalized and used for metadata", () => {
  const config = resolveSiteConfig({ NODE_ENV: "production", VERCEL_ENV: "production", SITE_ORIGIN: " https://PORTFOLIO.example.test/ " });
  assert.equal(config.productionOrigin, "https://portfolio.example.test");
  assert.equal(config.indexable, true);
  assert.equal(config.metadataBase, config.productionOrigin);
});

test("preview, custom and development environments remain noindex with a production origin", () => {
  for (const environment of ["preview", "development", "staging"]) {
    const config = resolveSiteConfig({ NODE_ENV: "production", VERCEL_ENV: environment, SITE_ORIGIN: "https://portfolio.example.test", VERCEL_URL: "portfolio-preview.vercel.app" });
    assert.equal(config.indexable, false);
    assert.equal(config.metadataBase, "https://portfolio-preview.vercel.app");
  }
  assert.equal(resolveSiteConfig({ NODE_ENV: "development", SITE_ORIGIN: "https://portfolio.example.test" }).indexable, false);
  assert.equal(resolveSiteConfig({ NODE_ENV: "production", VERCEL_ENV: "production", VERCEL_TARGET_ENV: "staging", SITE_ORIGIN: "https://portfolio.example.test" }).indexable, false);
});

test("invalid canonical origins fail clearly without printing configured values", () => {
  for (const value of ["http://example.test", "https://example.test/path", "https://example.test/?q=x", "https://example.test/#hash", "https://user:private-password@example.test", "javascript:alert(1)", "https://localhost", "https://127.0.0.1", "https://[::1]"]) {
    assert.throws(() => resolveSiteConfig({ SITE_ORIGIN: value }), error => error instanceof Error && error.message.startsWith("SITE_ORIGIN must") && !error.message.includes(value));
  }
});
