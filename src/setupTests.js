import "@testing-library/jest-dom";

// Create a mock DOM environment
const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost:8000",
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = window.localStorage;
global.sessionStorage = window.sessionStorage;

// Mock environment variables
process.env.VITE_API_URL = "http://localhost:8000/api";
process.env.VITE_WS_URL = "ws://localhost:8000";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator.onLine
Object.defineProperty(window.navigator, "onLine", {
  value: true,
  writable: true,
  configurable: true,
});

// Mock serviceWorker
Object.defineProperty(window.navigator, "serviceWorker", {
  value: {
    register: jest.fn().mockResolvedValue({}),
  },
  writable: true,
  configurable: true,
});

// WebSocket mock
class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    this.sentMessages = [];

    // Simulate connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) this.onopen();
    }, 0);
  }

  send(data) {
    this.sentMessages.push(JSON.parse(data));
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) this.onclose({ code: 1000 });
  }
}

// Set WebSocket constants
WebSocketMock.CONNECTING = 0;
WebSocketMock.OPEN = 1;
WebSocketMock.CLOSING = 2;
WebSocketMock.CLOSED = 3;

global.WebSocket = WebSocketMock;

// Mock console methods
const originalConsole = { ...console };

// Suppress specific warnings
console.error = (...args) => {
  const errorMessage = args.join(" ");
  // Don't fail on certain warnings
  if (
    errorMessage.includes(
      "ReactDOM.render is no longer supported in React 18"
    ) ||
    errorMessage.includes("ReactDOMTestUtils.act is deprecated") ||
    errorMessage.includes("Warning:") ||
    errorMessage.includes("act(") ||
    errorMessage.includes("React.createElement: type is invalid")
  ) {
    return;
  }
  originalConsole.error(...args);
};

// Suppress specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0] || "";
  // Suppress specific warnings
  if (
    msg.includes("ReactDOM.render is no longer supported in React 18") ||
    msg.includes("componentWillReceiveProps has been renamed") ||
    msg.includes("componentWillMount has been renamed") ||
    msg.includes("componentWillUpdate has been renamed") ||
    msg.includes("ReactDOMTestUtils.act is deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

window.IntersectionObserver = IntersectionObserver;

// Mock ResizeObserver
class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

window.ResizeObserver = ResizeObserver;
