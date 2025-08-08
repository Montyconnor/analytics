import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress Recharts warnings about zero dimensions in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes(
      "The width(0) and height(0) of chart should be greater than 0"
    )
  ) {
    return; // Suppress Recharts dimension warnings
  }

  // Suppress React act() warnings
  if (typeof args[0] === "string" && args[0].includes("act")) {
    return; // Suppress React act warnings
  }

  originalWarn(...args);
};

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for chart components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver for lazy loading
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
