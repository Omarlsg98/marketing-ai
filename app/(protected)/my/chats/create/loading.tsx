import ChatUI from "@/components/chat-components/Chat";
import { Chat } from "@/types/database";

export default function PersonaProfileSkeleton() {
const emptyChat: Chat = {
    context: "test",
    created_at: "2021-10-01T00:00:00.000Z",
    description: "test",
    display_info: null as any,
    id: "1",
    is_first_interaction: true,
    progress: 0,
    state: "test",
    status: "new",
    title: "test",
    updated_at: "2021-10-01T00:00:00.000Z",
    user_id: "1",
    deleted_at: "",
    last_message_id_in_context: "sdfsdf",
    object_context_id: "",
    substep_id: 0,
  };

  return (
    <ChatUI
      chatInitial={emptyChat}
      messagesInitial={[]}
      handleSendMessage={null}
      initLoading={true}
      fetchObjects={null}
    />
  );
}