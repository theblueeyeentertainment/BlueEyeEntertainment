"use client";

import { useEffect, useRef, useState } from "react";

const IMAGES = ["/eye.png", "/eye2.png"];
const DISPLAY_MS = 2000;
const FADE_MS = 1000;

export default function GlobalEyeBackground() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Cycle between images every DISPLAY_MS
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, DISPLAY_MS + FADE_MS);
    return () => clearInterval(timer);
  }, []);

  // 3D tilt on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const eyeX = window.innerWidth / 2;
      const eyeY = window.innerHeight / 2;

      const maxTilt = 45;
      const dx = (e.clientX - eyeX) / window.innerWidth;
      const dy = (e.clientY - eyeY) / window.innerHeight;

      const clampedDx = Math.max(-1, Math.min(1, dx));
      const clampedDy = Math.max(-1, Math.min(1, dy));

      eyeRef.current.style.transform = `perspective(800px) rotateX(${-clampedDy * maxTilt}deg) rotateY(${clampedDx * maxTilt}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={eyeRef} className="global-eye-container">
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Universal Background"
          className="eyeball-img"
          draggable="false"
          style={{
            position: i === 0 ? "relative" : "absolute",
            top: 0,
            left: 0,
            opacity: activeIndex === i ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}
