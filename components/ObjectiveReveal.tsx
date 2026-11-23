"use client";

import { useEffect, useRef, useState } from "react";

type Objective = {
  number: string;
  title: string;
  text: string;
};

export default function ObjectiveReveal({ objective, index }: { objective: Objective; index: number }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -45px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className={visible ? "program-card objective-card objective-reveal is-visible" : "program-card objective-card objective-reveal"}
      style={{ ["--reveal-delay" as string]: `${index * 130}ms` }}
    >
      <span>{objective.number}</span>
      <h3>{objective.title}</h3>
      <p>{objective.text}</p>
    </article>
  );
}
