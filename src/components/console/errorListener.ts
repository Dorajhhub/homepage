import { errorStore } from "./errorStore";

export function initErrorListener() {
  // console.error 가로채기
  const originalError = console.error;
  console.error = (...args) => {
    errorStore.setError({
      message: args.map(String).join(" "),
    });
    originalError(...args);
  };

  // 런타임 에러
  window.onerror = (message, source, lineno, colno, error) => {
    errorStore.setError({
      message: String(message),
      stack: error?.stack,
    });
  };

  // Promise 에러
  window.addEventListener("unhandledrejection", (e) => {
    errorStore.setError({
      message: String(e.reason),
    });
  });
}
