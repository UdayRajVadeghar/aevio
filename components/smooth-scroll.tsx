"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isTouchLikeDevice, setIsTouchLikeDevice] = useState(true);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hasTouchInput =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchLikeDevice(coarsePointer || hasTouchInput);
  }, []);

  // Keep native scrolling on mobile/touch devices to avoid
  // momentum conflicts and scroll snap-backs during stage transitions.
  if (isTouchLikeDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 1.5,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
