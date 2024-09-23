import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatEditColumnAboutMe,
  ChatEditColumnComponent,
} from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { CheckCircle } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";

interface AboutMeTabProps {
  displayInfo: ChatEditColumnComponent;
  handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  submitting: boolean;
}

const AboutMeTab: FC<AboutMeTabProps> = ({
  displayInfo,
  handleDone,
  submitting,
}) => {
  const currentInfo = displayInfo.current as ChatEditColumnAboutMe;

  const [aboutMe, setAboutMe] = useState(currentInfo);
  const [hasChanges, setHasChanges] = useState(false);

  if (!currentInfo) {
    return null;
  }

  const submitInfo = async () => {
    if (!hasChanges) {
      await handleDone("LGTM!", {
        saved: true,
      });
    } else {
      await handleDone("What do you think about these changes?", {
        edited: true,
        modifications: aboutMe,
      });
    }
  };

  return (
    <Card className="cursor-pointer transition-all duration-300 hover:bg-secondary">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2">About Me</h3>
        <Textarea
          className="w-full"
          placeholder="Enter information about the persona"
          value={aboutMe.aboutMe}
          onChange={(e) => {
            setAboutMe((prev) => ({ ...prev, aboutMe: e.target.value }));
            setHasChanges(true);
          }}
          rows={30}
        />
      </CardContent>
      <div className="flex justify-center mt-6">
        <Button
          onClick={submitInfo}
          disabled={submitting}
          className="px-6 py-2 text-lg"
        >
          {submitting
            ? "Submitting..."
            : hasChanges
              ? "Submit Changes"
              : "Done"}
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default AboutMeTab;
