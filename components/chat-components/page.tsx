'use client'

import { useState, useRef, useEffect } from 'react'
import { UserAvatar } from "@/components/ui/chat/UserAvatar"
import { MessageBubble } from "@/components/ui/chat/MessageBubble"
import { ChatInput } from "@/components/ui/chat/ChatInput"
import { ResizableDivider } from "@/components/ui/chat/ResizableDivider"
import { ComponentDisplay } from "@/components/ui/chat/ComponentDisplay"

export default function Chat() {
  const [chatWidth, setChatWidth] = useState(50) // 50% initial width
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
    { role: 'user', content: 'Can you help me with a React question?' },
    { role: 'assistant', content: 'Of course! I\'d be happy to help with your React question. What would you like to know?' },
  ])
  const [userGradient] = useState(() => {
    const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)]
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)]
    return `bg-gradient-to-br from-${randomColor1}-400 to-${randomColor2}-500`
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleResize = (clientX: number) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const newWidth = (clientX / containerWidth) * 100
      setChatWidth(Math.min(Math.max(newWidth, 20), 80)) // Limit between 20% and 80%
    }
  }

  const handleSendMessage = (content: string) => {
    setMessages([...messages, { role: 'user', content }])
    // Here you would typically send the message to your AI service
    // and then add the response to the messages
  }

  const handleFileUpload = (file: File) => {
    // Handle file upload logic here
    console.log('File uploaded:', file)
    // You might want to send this file to your server or process it client-side
    setMessages([...messages, { role: 'user', content: `Uploaded file: ${file.name}` }])
  }

  return (
    <div ref={containerRef} className="flex h-screen bg-background text-foreground">
      {/* Chat Section */}
      <div className="flex flex-col" style={{ width: `${chatWidth}%`, minWidth: '300px' }}>
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isUser={message.role === 'user'}
            >
              {message.role === 'user' ? (
                <UserAvatar userImage={null} gradientClass={userGradient} />
              ) : (
                <UserAvatar userImage="/placeholder.svg?height=40&width=40" />
              )}
            </MessageBubble>
          ))}
        </div>
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
        />
      </div>

      <ResizableDivider onResize={handleResize} />

      <ComponentDisplay
        chatWidth={chatWidth}
        minChatWidth={300}
      />
    </div>
  )
}