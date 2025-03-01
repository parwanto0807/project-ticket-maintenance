"use client";
import { useState } from "react";

export default function ReadMoreText({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= 100) return <>{text}</>;

  return (
    <>
      {isExpanded ? text : `${text.slice(0, 100)}... `}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`ml-2 hover:underline ${
          isExpanded ? "text-red-500" : "text-blue-500"
        }`}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </>
  );
}
