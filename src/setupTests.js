import "@testing-library/jest-dom";

if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}
if (typeof TextDecoder === "undefined") {
  global.TextDecoder = require("util").TextDecoder;
}

const mockWindow = {
  location: new URL("http://localhost:8000"),
  navigator: {
    onLine: true,
    userAgent: "node.js",
    serviceWorker: {
      register: jest.fn().mockResolvedValue({}),
    },
  },
  localStorage: (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })(),
  sessionStorage: (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

global.window = mockWindow;
global.document = {
  createElement: jest.fn(() => ({})),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  getElementById: jest.fn(),
  getElementsByClassName: jest.fn(),
  getElementsByTagName: jest.fn(),
};
global.localStorage = mockWindow.localStorage;
global.sessionStorage = mockWindow.sessionStorage;
global.navigator = mockWindow.navigator;

process.env.VITE_API_URL = "http://localhost:8000/api";
process.env.VITE_WS_URL = "ws://localhost:8000";

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

class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    this.sentMessages = [];

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

WebSocketMock.CONNECTING = 0;
WebSocketMock.OPEN = 1;
WebSocketMock.CLOSING = 2;
WebSocketMock.CLOSED = 3;

global.WebSocket = WebSocketMock;

const originalConsole = { ...console };

console.error = (...args) => {
  const errorMessage = args.join(" ");
  if (
    errorMessage.includes(
      "ReactDOM.render is no longer supported in React 18"
    ) ||
    errorMessage.includes("ReactDOMTestUtils.act is deprecated") ||
    errorMessage.includes("Warning:") ||
    errorMessage.includes("act(") ||
    errorMessage.includes("React.createElement: type is invalid") ||
    errorMessage.includes("import.meta")
  ) {
    return;
  }
  originalConsole.error(...args);
};

console.warn = (...args) => {
  const msg = args[0] || "";
  if (
    msg.includes("ReactDOM.render is no longer supported in React 18") ||
    msg.includes("componentWillReceiveProps has been renamed") ||
    msg.includes("componentWillMount has been renamed") ||
    msg.includes("componentWillUpdate has been renamed") ||
    msg.includes("ReactDOMTestUtils.act is deprecated")
  ) {
    return;
  }
  originalConsole.warn(...args);
};

class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

global.IntersectionObserver = IntersectionObserver;

class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

global.ResizeObserver = ResizeObserver;
