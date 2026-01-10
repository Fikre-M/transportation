import { renderHook, act } from "@testing-library/react";
import { useOfflineStatus, registerServiceWorker } from "../offline";

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsole.error;
  console.log = originalConsole.log;
});

describe("useOfflineStatus", () => {
  beforeEach(() => {
    // Reset to online before each test
    Object.defineProperty(window.navigator, "onLine", {
      value: true,
      writable: true,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  it("should return initial online status", () => {
    const { result } = renderHook(() => useOfflineStatus());
    expect(result.current).toBe(false); // Returns offline status, so true = offline
  });

  it("should update status when going offline", () => {
    const { result } = renderHook(() => useOfflineStatus());

    // Simulate going offline
    act(() => {
      Object.defineProperty(window.navigator, "onLine", { value: false });
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(true); // true means offline
  });

  it("should update status when going online", () => {
    // Start offline
    Object.defineProperty(window.navigator, "onLine", { value: false });

    const { result } = renderHook(() => useOfflineStatus());

    // Simulate going online
    act(() => {
      Object.defineProperty(window.navigator, "onLine", { value: true });
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(false); // false means online
  });
});

describe("registerServiceWorker", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("should register service worker when available", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await registerServiceWorker();

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith("/sw.js");
    consoleSpy.mockRestore();
  });

  it("should handle service worker registration failure", async () => {
    const error = new Error("Registration failed");
    const registerMock = jest.fn().mockRejectedValueOnce(error);
    Object.defineProperty(window.navigator.serviceWorker, "register", {
      value: registerMock,
      writable: true,
    });

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await registerServiceWorker();

    expect(consoleSpy).toHaveBeenCalledWith(
      "ServiceWorker registration failed:",
      error
    );
    consoleSpy.mockRestore();
  });
});
