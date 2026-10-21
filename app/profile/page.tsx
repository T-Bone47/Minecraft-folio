"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileSpawn } from "@/components/profile/ProfileSpawn";

export default function ProfileRoute() {
  const router = useRouter();

  const handleEnterWorld = () => {
    router.push("/world");
  };

  return <ProfileSpawn onEnterWorld={handleEnterWorld} />;
}
