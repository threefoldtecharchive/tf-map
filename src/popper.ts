import type { VirtualElement } from "@popperjs/core";

export function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
  });
}

export const virtualElement = {
  getBoundingClientRect: generateGetBoundingClientRect(),
} as unknown as VirtualElement;
