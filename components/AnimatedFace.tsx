"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedFace() {
  const faceRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!faceRef.current) return;

      const rect = faceRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / 25;
      const deltaY = (e.clientY - centerY) / 25;

      setEyePosition({
        x: Math.max(Math.min(deltaX, 6), -6),
        y: Math.max(Math.min(deltaY, 6), -6),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={faceRef}
      className="relative w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center"
    >
      {/* Eyes */}
      <div
        className="absolute w-2 h-2 bg-black rounded-full"
        style={{
          left: `8px`,
          top: `10px`,
          transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
        }}
      />
      <div
        className="absolute w-2 h-2 bg-black rounded-full"
        style={{
          right: `8px`,
          top: `10px`,
          transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
        }}
      />

      {/* Smile */}
      <div className="absolute bottom-2 w-4 h-2 border-b-2 border-black rounded-full" />
    </div>
  );
}
