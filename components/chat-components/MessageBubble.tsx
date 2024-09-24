import React from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

interface MessageBubbleProps {
  message: {
    role: string;
    content: string;
  };
  isUser: boolean;
  children: React.ReactNode;
}

export function MessageBubble({
  message,
  isUser,
  children,
}: MessageBubbleProps) {
  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-center space-x-4 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {children}
        <div
          className={`prose p-4 rounded-lg max-w-[calc(100%-3.5rem)] ${isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
