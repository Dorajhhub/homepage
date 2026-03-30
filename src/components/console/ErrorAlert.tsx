import { useEffect, useState } from "react";
import { errorStore } from "../console/errorStore";

export function ErrorAlert() {
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    return errorStore.subscribe(setError);
  }, []);

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#ff4d4f",
        color: "#fff",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <strong>오류 발생</strong>
      <div>{error.message}</div>
      <button onClick={() => errorStore.clear()}>닫기</button>
    </div>
  );
}
