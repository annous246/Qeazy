import React, { useEffect, useRef, useState } from "react";

export default function Loading() {
  const container = useRef<any>(null);
  const title = useRef<any>(null);
  const [phrase, setPhrase] = useState<string>(
    "Cooking up your quiz with AI magic..."
  );
  let id: number | null = null;
  useEffect(() => {
    if (container.current) {
      console.log("here");
      container.current.style.opacity = "1";
      id = setInterval(() => {
        setPhrase((p) => {
          if (p.length < 37) {
            return p + ".";
          } else {
            return p.slice(0, p.length - 3);
          }
        });
      }, 700);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, []);
  return (
    <div ref={container} className="loading">
      <div className="loading-cap">
        <h2>{phrase}</h2>
        <h1>🤖</h1>
      </div>
    </div>
  );
}
