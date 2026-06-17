// Touch devices should use browser-native scrolling.
// Custom scroll animations can block mobile gestures until the animation ends.
export function isTouchScrollDevice() {
  if (typeof window === "undefined") return false;

  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasNoHover = window.matchMedia("(hover: none)").matches;
  const hasTouchPoints = navigator.maxTouchPoints > 0;

  return hasCoarsePointer || hasNoHover || hasTouchPoints;
}
