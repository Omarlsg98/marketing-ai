import React from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: {
    role: string
    content: string
  }
  isUser: boolean
  children?: React.ReactNode
}

export function MessageBubble({ message, isUser, children }: MessageBubbleProps) {
  return (
    <div className={cn("flex mb-6", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-start space-x-4",
          isUser ? "flex-row-reverse space-x-reverse" : ""
        )}
      >
        {children}
        <div
          className={cn(
            "prose dark:prose-invert p-4 rounded-lg max-w-[calc(100%-3.5rem)]",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}