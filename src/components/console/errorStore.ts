type ErrorState = {
  message: string;
  stack?: string;
};

let currentError: ErrorState | null = null;
const listeners = new Set<(e: ErrorState | null) => void>();

export const errorStore = {
  setError(error: ErrorState) {
    currentError = error;
    listeners.forEach((l) => l(currentError));
  },
  clear() {
    currentError = null;
    listeners.forEach((l) => l(currentError));
  },
  subscribe(listener: (e: any) => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener); // 반환값 버림
    };
  },
};
