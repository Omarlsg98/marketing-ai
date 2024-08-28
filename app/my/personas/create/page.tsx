'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Component() {


  const router = useRouter();

  useEffect(() => {
    const startChat = async () => {
      const newChat = await fetch('/api/chat/create', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Persona', description: 'New persona chat', category: 'Persona B2B' })
      });

      const {chat} = await newChat.json();
      console.log(chat);

      const chatId = chat.id;

      await fetch(`/api/chat/${chatId}/send`, {
        method: 'POST',
        body: JSON.stringify({ message: "Hello! can you help me build my customer persona?" })
      });

      //redirect to chat page
      router.push(`/my/personas/chat/${chatId}`);
    }
    startChat();
  }, [])

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-muted">

    </div>
  )
}