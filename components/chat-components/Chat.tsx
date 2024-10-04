"use client";

import { ChatInput } from "@/components/chat-components/ChatInput";
import LottieLoader from "@/components/chat-components/loader/LottieLoader";
import { MessageBubble } from "@/components/chat-components/MessageBubble";
import { ResizableDivider } from "@/components/chat-components/ResizableDivider";
import { UserAvatar } from "@/components/chat-components/UserAvatar";
import { handleMessages } from "@/lib/client/chat";
import {
  ChatEditColumnComponent,
  ObjectFetchMapping,
} from "@/types/components/chatTab";
import { Chat, Message } from "@/types/database";
import { ExtraInfo } from "@/types/interseed/chat";
import { FC, useEffect, useRef, useState } from "react";
import ChatRightPanel from "./RightPanel";

interface ChatMessage {
  content: string;
  id: string;
  role: "user" | "assistant" | "system";
  failed?: boolean;
}

interface ChatProps {
  chatInitial: Chat | null;
  messagesInitial: ChatMessage[];
  handleSendMessage?: (
    chatId: string,
    message: string,
    extraInfo?: ExtraInfo
  ) => Promise<{
    chat: Chat;
    messages: Message[];
  }>;
  initLoading?: boolean;
  fetchObjects: ObjectFetchMapping;
}

const ChatUI: FC<ChatProps> = ({
  chatInitial,
  messagesInitial,
  handleSendMessage = handleMessages,
  initLoading,
  fetchObjects,
}) => {
  const [chat, setChat] = useState(chatInitial);
  const [messages, setMessages] = useState(messagesInitial);
  const [chatWidth, setChatWidth] = useState(100); // 50% initial width
  const [loading, setLoading] = useState(initLoading || false);

  useEffect(() => {
    if (chat && (chat.display_info !== null || chat.state === "end")) {
      setChatWidth(50);
    } else {
      setChatWidth(100);
    }
  }, [chat]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (clientX: number) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = (clientX / containerWidth) * 100;
      setChatWidth(Math.min(Math.max(newWidth, 20), 80)); // Limit between 20% and 80%
    }
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
  };

  const handleSendMessageWrapper: (
    content: string,
    extraInfo?: ExtraInfo
  ) => Promise<void> = async (content, extraInfo) => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        content,
        id: "temp",
        role: "user",
      },
    ]);
    const { chat: newChat, messages: newMessages } = await handleSendMessage(
      chat.id,
      content,
      extraInfo
    );
    setChat(newChat);
    setMessages((prev) => [...prev.slice(0, -1), ...newMessages]);
    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="flex h-screen bg-background text-foreground"
    >
      {/* Chat Section */}
      <div
        className="flex flex-col"
        style={{ width: `${chatWidth}%`, minWidth: "300px" }}
      >
        <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isUser={message.role === "user"}
            >
              {message.role === "user" ? (
                <UserAvatar userImage="/placeholder.svg?height=40&width=40" />
              ) : (
                <UserAvatar userImage="/placeholder.svg?height=40&width=40" />
              )}
            </MessageBubble>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 mt-4">
              <UserAvatar userImage="/placeholder.svg?height=40&width=40" />
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                <LottieLoader width={100} height={40} />
              </div>
            </div>
          )}
        </div>
        <ChatInput
          onSendMessage={handleSendMessageWrapper}
          onFileUpload={handleFileUpload}
          isLoading={loading}
        />
      </div>

      {/* Right Panel */}
      {chatWidth != 100 &&
        chat &&
        (chat.display_info !== null || chat.state === "end") && (
          <>
            <ResizableDivider onResize={handleResize} />
            <div className="flex-1 overflow-auto p-4">
              <ChatRightPanel
                onDone={handleSendMessageWrapper}
                displayInfo={
                  JSON.parse(
                    chat.display_info as string
                  ) as ChatEditColumnComponent
                }
                isLoading={loading}
                isEnd={chat.state === "end"}
                objectId={chat.object_context_id}
                objectType={"persona"} // TODO: Change this to get it from Chat
                fetchObjects={fetchObjects}
              />
            </div>
          </>
        )}
    </div>
  );
};

export default ChatUI;
