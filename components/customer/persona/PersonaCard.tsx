import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PersonaCardProps {
  name: string | null;
  type: string;
  coverage: number | null;
  avatarSrc: string | null;
}

export default function PersonaCard({
  name,
  type,
  coverage,
  avatarSrc,
}: PersonaCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={name} />
          ) : (
            <AvatarFallback>
              {name ? name.slice(0, 2).toUpperCase() : "MP"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">
            {name || "Mysterious Persona"}
          </h2>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>
      {coverage ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Coverage</p>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${coverage}%` }}
            ></div>
          </div>
          <p className="text-sm text-right">{coverage}%</p>
        </div>
      ) : null}
    </div>
  );
}
