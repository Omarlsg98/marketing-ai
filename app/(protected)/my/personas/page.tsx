import PersonaStats from "@/components/customer/persona/PersonaStats";
import PersonaTabs from "@/components/customer/persona/PersonaTabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PersonasPage() {
  return (
    <div className="bg-background text-foreground w-full h-full overflow-auto">
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Customer Insights
            </h1>
            <p className="text-sm text-muted-foreground">
              Understand your customer personas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/my/personas/list">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Personas
              </Button>
            </Link>
            <Link href="/my/chats/create">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground">
                Create Persona
              </Button>
            </Link>
          </div>
        </div>

        <PersonaStats />
        <PersonaTabs />
      </div>
    </div>
  );
}
