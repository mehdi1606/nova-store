import type Lenis from "lenis";

let _lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  _lenis = l;
};
export const getLenis = () => _lenis;

/** Lock/unlock page scroll (used by menu overlay & cart drawer). */
export function lockScroll(lock: boolean) {
  if (_lenis) {
    if (lock) _lenis.stop();
    else _lenis.start();
  }
  if (typeof document !== "undefined") {
    document.body.style.overflow = lock ? "hidden" : "";
  }
}
