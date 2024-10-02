import PersonaCard from "@/components/customer/persona/PersonaCard";
import { Button } from "@/components/ui/button";
import { PersonaList } from "@/types/components/persona";
import { Bot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PersonasListProps {
  personas?: PersonaList;
}

export default function PersonasList({ personas = [] }: PersonasListProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Personas</h1>
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
        {(!personas || personas.length === 0) ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center py-8">
            <h2 className="text-2xl font-bold mb-4">No personas yet</h2>
            <div className="relative w-full max-w-[500px] aspect-square mb-6">
              <Image
                src="/assets/empty-state/default.svg"
                alt="Empty state illustration"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-muted-foreground mb-6">
              Talk with Ethan the agent to create personas
            </p>
            <Link href="/my/chats/create" passHref>
              <Button asChild>
                <span>
                  <Bot size={24} className="mr-2" />
                  Chat with Ethan
                </span>
              </Button>
            </Link>
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
                  coverage={null}
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