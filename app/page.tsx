"use client";
import Image from "next/image";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";

import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-8 px-24">
      <Hero />
    </main>
  );
}
