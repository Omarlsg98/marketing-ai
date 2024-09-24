import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatEditColumnComponent,
  ChatEditColumnImage,
} from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { CheckCircle } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

interface ImageGenerationTabProps {
  displayInfo: ChatEditColumnComponent;
  handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  submitting: boolean;
}

const ImageGenerationTab: FC<ImageGenerationTabProps> = ({
  displayInfo,
  handleDone,
  submitting,
}) => {
  const currentInfo = displayInfo.current as ChatEditColumnImage;
  if (!currentInfo) {
    return null;
  }

  const submitInfo = async () => {
    await handleDone("LGTM, let's go to the next section!", {
      saved: true,
    });
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Persona Image</CardTitle>
          <p className="mb-1 text-sm text-muted-foreground">
            Do you like the image? If not you can instruct the AI to 
            generate a new one, and/or modify the prompt.
          </p>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <div className="mb-4 overflow-hidden rounded-lg shadow w-96">
              <img
                src={
                  currentInfo.imageUrl ||
                  "/placeholder.svg?height=400&width=400"
                }
                alt="Persona portrait"
                className="h-96 w-96 object-cover"
              />
            </div>
          </div>
          <Textarea
            className="mb-4"
            placeholder="Enter image generation prompt"
            value={currentInfo.imagePrompt}
            disabled={true}
            rows={10}
          />
        </CardContent>
      </Card>
      <div className="flex justify-center mt-6">
        <Button
          onClick={submitInfo}
          disabled={submitting}
          className="px-6 py-2 text-lg"
        >
          {submitting ? "Submitting..." : "Done"}
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ImageGenerationTab;
