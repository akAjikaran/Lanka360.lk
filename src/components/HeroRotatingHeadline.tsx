"use client";

import { useEffect, useState } from "react";

const words = ["Creators", "Businesses", "Innovators", "Makers", "Builders"];

export function HeroRotatingHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <h1 className="max-w-2xl text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
      One place to find Passionate{" "}
      <span className="inline-grid min-w-[9ch] overflow-hidden align-bottom text-brand-dark">
        <span key={words[index]} className="animate-[fadeSlideIn_0.45s_ease-out]">
          {words[index]}
        </span>
      </span>{" "}
      across Sri Lanka.
    </h1>
  );
}
