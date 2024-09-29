import PersonaCard from "@/components/customer/persona/PersonaCard";
import { Button } from "@/components/ui/button";
import { PersonaList } from "@/types/components/persona";
import { Bot } from "lucide-react";
import Link from "next/link";

interface PersonasListProps {
  personas: PersonaList;
}

export default function PersonasList({ personas }: PersonasListProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Personas</h1>
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
        {personas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-2xl font-bold mb-4">No personas yet</h2>
            <p className="text-muted-foreground mb-6">
              Talk with Ethan the agent to create personas
            </p>
            <Button>
              <Bot size={24} className="pr-1" />
              <Link href="/my/chats/create">Chat with Ethan</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <Link
                key={persona.id}
                href={
                  !persona.isSuggestion ? `/my/personas/${persona.id}` : "#"
                }
              >
                <PersonaCard
                  key={persona.id}
                  name={persona.name}
                  type={persona.title}
                  coverage={null} // You might want to replace this with actual data
                  avatarSrc={persona.image_url}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
