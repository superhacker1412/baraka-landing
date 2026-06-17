import { useEffect, useRef, type ReactNode } from "react";

import { isTouchScrollDevice } from "../lib/device";

export function RubberBand({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const velocity = useRef(0);
  const animating = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const springFrame = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Mobile browsers already have native edge bounce.
    // We skip JS rubber-band there so touch scroll never waits for our spring animation.
    if (isTouchScrollDevice()) return;

    const MAX = 140;
    const RESIST = 0.35;
    const SPRING = 0.18;
    const DAMPING = 0.72;

    const apply = () => {
      el.style.transform =
        Math.abs(offset.current) < 0.1 ? "" : `translate3d(0, ${offset.current}px, 0)`;
    };

    const stopSpring = () => {
      animating.current = false;
      velocity.current = 0;
      if (springFrame.current != null) {
        cancelAnimationFrame(springFrame.current);
        springFrame.current = null;
      }
    };

    const resetRubber = () => {
      stopSpring();
      offset.current = 0;
      apply();
    };

    const damp = (raw: number) => {
      const sign = Math.sign(raw);
      const abs = Math.abs(raw);
      return sign * MAX * (1 - 1 / (1 + (abs * RESIST) / MAX));
    };

    const springBack = () => {
      if (animating.current) return;
      animating.current = true;

      const step = () => {
        if (!animating.current) return;

        velocity.current += (0 - offset.current) * SPRING;
        velocity.current *= DAMPING;
        offset.current += velocity.current;

        if (Math.abs(offset.current) < 0.3 && Math.abs(velocity.current) < 0.3) {
          offset.current = 0;
          velocity.current = 0;
          apply();
          animating.current = false;
          springFrame.current = null;
          return;
        }

        apply();
        springFrame.current = requestAnimationFrame(step);
      };

      springFrame.current = requestAnimationFrame(step);
    };

    const atTop = () => window.scrollY <= 0;
    const atBottom = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;

    const canScrollInsideTarget = (target: EventTarget | null, deltaY: number) => {
      let node = target instanceof Element ? target : null;

      while (node && node !== document.body && node !== document.documentElement) {
        const style = window.getComputedStyle(node);
        const isScrollable =
          /(auto|scroll|overlay)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;

        if (isScrollable) {
          const maxScroll = node.scrollHeight - node.clientHeight;
          if (deltaY > 0 && node.scrollTop < maxScroll - 1) return true;
          if (deltaY < 0 && node.scrollTop > 1) return true;
        }

        node = node.parentElement;
      }

      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (canScrollInsideTarget(e.target, e.deltaY)) return;

      const dy = e.deltaY;
      const rawPull = -dy / 2;
      const pullingPastEdge = (atTop() && dy < 0) || (atBottom() && dy > 0);

      if (!pullingPastEdge) {
        if (offset.current !== 0) resetRubber();
        return;
      }

      if (offset.current !== 0 && Math.sign(rawPull) !== Math.sign(offset.current)) {
        resetRubber();
        return;
      }

      stopSpring();
      e.preventDefault();

      offset.current = damp(offset.current + rawPull);
      apply();

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(springBack, 90);
    };

    const onTouchStart = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y == null) return;

      if (offset.current !== 0) resetRubber();
      touchStartY.current = y;
      lastTouchY.current = y;
      stopSpring();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current == null) return;

      const y = e.touches[0]?.clientY;
      if (y == null) return;

      const dy = y - (lastTouchY.current ?? y);
      lastTouchY.current = y;
      if (dy === 0) return;

      if (canScrollInsideTarget(e.target, -dy)) {
        if (offset.current !== 0) resetRubber();
        return;
      }

      const pullingPastEdge = (dy > 0 && atTop()) || (dy < 0 && atBottom());

      if (!pullingPastEdge) {
        if (offset.current !== 0) resetRubber();
        return;
      }

      if (offset.current !== 0 && Math.sign(dy) !== Math.sign(offset.current)) {
        resetRubber();
        return;
      }

      e.preventDefault();
      offset.current = damp(offset.current + dy);
      apply();
    };

    const onTouchEnd = () => {
      touchStartY.current = null;
      lastTouchY.current = null;
      if (offset.current !== 0) springBack();
    };

    const onScroll = () => {
      if (offset.current !== 0 && !atTop() && !atBottom()) resetRubber();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", resetRubber);
    document.addEventListener("visibilitychange", resetRubber);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", resetRubber);
      document.removeEventListener("visibilitychange", resetRubber);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      stopSpring();
      el.style.transform = "";
    };
  }, []);

  return (
    <div ref={ref} style={{ willChange: "transform", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
