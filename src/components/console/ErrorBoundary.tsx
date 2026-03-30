import React from "react";
import { errorStore } from "./errorStore";

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  componentDidCatch(error: Error) {
    errorStore.setError({
      message: error.message,
      stack: error.stack,
    });
  }

  render() {
    return this.props.children;
  }
}
