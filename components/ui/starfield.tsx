"use client";

import React, { useEffect, useRef } from "react";

interface StarfieldProps {
  speed?: number;
  backgroundColor?: string;
  starColor?: string;
  count?: number;
}

export function Starfield({
  speed = 0.05,
  backgroundColor = "transparent",
  starColor = "#ffffff",
  count = 800,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number; o: number }[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          z: Math.random() * width,
          o: Math.random(),
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.z -= speed * 10;

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
        }

        const x = (star.x / star.z) * width + width / 2;
        const y = (star.y / star.z) * height + height / 2;
        const size = (1 - star.z / width) * 2.5;
        const opacity = (1 - star.z / width) * star.o;

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.beginPath();
          ctx.fillStyle = starColor;
          ctx.globalAlpha = opacity;
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, backgroundColor, starColor, count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: backgroundColor }}
    />
  );
}
