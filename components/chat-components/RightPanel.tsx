import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChatEditColumnComponent,
  ObjectFetchMapping,
  PersonaAllTabs,
} from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { CircleSlash, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import AboutMeTab from "./AboutMeTab";
import CustomerJourneyTab from "./CustomerJourneyTab";
import ImageGenerationTab from "./ImageGenerationTab";
import PersonaSelectorTab from "./PersonaSelectorTab";
import PersonaTab from "./PersonaTab";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
}

const LoadingWrapper: FC<LoadingWrapperProps> = ({ children, isLoading }) => {
  return isLoading ? (
    <div className="flex justify-center">
      <div className="animate-pulse w-1/2 h-4 bg-gray-200 rounded-full"></div>
    </div>
  ) : (
    <>{children}</>
  );
};

interface ChatRightPanelProps {
  displayInfo: ChatEditColumnComponent;
  onDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  isLoading: boolean;
  isEnd: boolean;
  objectId: string | null;
  objectType: keyof ObjectFetchMapping;
  fetchObjects: ObjectFetchMapping;
}

const tabsMapping: {
  [K in keyof PersonaAllTabs]: {
    tabTitle: string;
    tabContent: FC<{
      displayInfo: ChatEditColumnComponent;
      handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
      submitting: boolean;
    }>;
  };
} = {
  multiplePersona: {
    tabTitle: "All Personas",
    tabContent: PersonaSelectorTab,
  },
  persona: {
    tabTitle: "Persona",
    tabContent: PersonaTab,
  },
  customerJourney: {
    tabTitle: "Customer Journey",
    tabContent: CustomerJourneyTab,
  },
  image: {
    tabTitle: "Image",
    tabContent: ImageGenerationTab,
  },
  aboutMe: {
    tabTitle: "About Me",
    tabContent: AboutMeTab,
  },
};

const ChatRightPanel: FC<ChatRightPanelProps> = ({
  displayInfo,
  onDone,
  isLoading,
  isEnd,
  objectId,
  objectType,
  fetchObjects,
}) => {
  const [activeTab, setActiveTab] = useState(displayInfo.type);
  const [submitting, setSubmitting] = useState(false);
  const [otherTabs, setOtherTabs] = useState({
    multiplePersona: null,
    persona: null,
    customerJourney: null,
    image: null,
    aboutMe: null,
  } as PersonaAllTabs);

  useEffect(() => {
    setActiveTab(displayInfo.type);
  }, [displayInfo]);

  useEffect(() => {
    fetchObjects[objectType as keyof ObjectFetchMapping](objectId).then(
      (data) => {
        setOtherTabs(data);
      }
    );
  }, [objectId, objectType]);

  const handleDone: (
    message: string,
    extraInfo: ExtraInfo
  ) => Promise<void> = async (message, extraInfo) => {
    setSubmitting(true);
    await onDone(message, extraInfo);
    if (extraInfo.saved && extraInfo.modifications) {
      if (extraInfo.modifications) {
        setOtherTabs((prev) => ({
          ...prev,
          [activeTab]: extraInfo.modifications,
        }));
      }
    }
    setSubmitting(false);
  };

  if (isEnd) {
    if (objectId === null) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-2xl font-bold mb-4">Nothing to show!</h2>
          <p className="text-muted-foreground mb-6">
            You can say Hi! again to start a new conversation.
          </p>
          <CircleSlash className="w-12 h-12 text-secondary-foreground" />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Persona Created!</h2>
        <p className="text-muted-foreground mb-6">
          You can now view your {objectType} here:
        </p>
        <Button>
          <UserRoundSearch className="w-6 h-6 inline-block" />{" "}
          <Link href={`/my/personas/${objectId}`}>View Persona</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-2">
      <Tabs
        value={activeTab}
        onValueChange={(
          value:
            | "multiplePersona"
            | "persona"
            | "customerJourney"
            | "image"
            | "aboutMe"
        ) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(tabsMapping).map(([key, value]) => (
            <TabsTrigger
              value={key}
              key={key}
              disabled={
                (otherTabs[key as keyof PersonaAllTabs] === null &&
                  displayInfo.type !== key) ||
                isLoading
              }
            >
              {value.tabTitle}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(tabsMapping).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            <LoadingWrapper isLoading={isLoading}>
              <value.tabContent
                displayInfo={
                  displayInfo.type == key
                    ? displayInfo
                    : {
                        type: key as keyof PersonaAllTabs,
                        old: null,
                        current: otherTabs[key as keyof PersonaAllTabs],
                      }
                }
                handleDone={handleDone}
                submitting={submitting}
              />
            </LoadingWrapper>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChatRightPanel;
