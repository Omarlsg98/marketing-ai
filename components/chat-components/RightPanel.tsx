import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatEditColumnComponent } from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { FC, ReactNode, useState } from "react";
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
}

const ChatRightPanel: FC<ChatRightPanelProps> = ({
  displayInfo,
  onDone,
  isLoading,
}) => {
  //const [activeTab, setActiveTab] = useState("multiplePersona");
  const [submitting, setSubmitting] = useState(false);
  const handleDone: (
    message: string,
    extraInfo: ExtraInfo
  ) => Promise<void> = async (message, extraInfo) => {
    setSubmitting(true);
    await onDone(message, extraInfo);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 mb-2">
      <Tabs
        value={displayInfo.type}
        //onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="multiplePersona">All Personas</TabsTrigger>
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="customerJourney">Customer Journey</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="aboutMe">About Me</TabsTrigger>
        </TabsList>

        <TabsContent value="multiplePersona">
          <LoadingWrapper isLoading={isLoading}>
            <PersonaSelectorTab
              displayInfo={displayInfo}
              handleDone={handleDone}
              submitting={submitting}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="persona">
          <LoadingWrapper isLoading={isLoading}>
            <PersonaTab
              displayInfo={displayInfo}
              handleDone={handleDone}
              submitting={submitting}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="customerJourney">
          <LoadingWrapper isLoading={isLoading}>
            <CustomerJourneyTab
              displayInfo={displayInfo}
              handleDone={handleDone}
              submitting={submitting}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="image">
          <LoadingWrapper isLoading={isLoading}>
            <ImageGenerationTab
              displayInfo={displayInfo}
              handleDone={handleDone}
              submitting={submitting}
            />
          </LoadingWrapper>
        </TabsContent>

        <TabsContent value="aboutMe">
          <LoadingWrapper isLoading={isLoading}>
            <AboutMeTab
              displayInfo={displayInfo}
              handleDone={handleDone}
              submitting={submitting}
            />
          </LoadingWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatRightPanel;
