import CustomerJourneyTabComponent from "@/components/customer-journey/CustomerJourneyTab";
import { CustomerJourneyInfo } from "@/lib/personaConstants";
import type { Meta, StoryObj } from "@storybook/react";

const personaInformationExample = {
  id: "aa",
  name: "John Doe",
  short_description: "A wonderful person",
  finished: true,
  chat_progress: 100,
  primary_goal: "To be happy",
  key_challenge: "To be sad",
  main_buying_motivation: "To be rich",
  image_path: "https://www.google.com",
  about_me: "I am a wonderful person",
  gender: "male",
  ethnicity: "white",
  location: "USA",
  occupation: "Engineer",
  profile: {
    demographics: ["age: 20", "income: 1000"],
    psychographics: ["happy", "sad"],
    goalsPainPoints: ["happy", "money"],
  },
  discovery: {
    informationSeekingBehavior: ["google", "bing"],
    preferredContentTypes: ["text", "video"],
    engagementPreferences: ["chat", "email"],
    influentialFactors: ["money", "happiness"],
    primarySources: ["google", "bing"],
    initialExpectations: ["money", "happiness"],
  },
  evaluation: {
    comparisonCriteria: ["price", "quality"],
    preferredComparisonMethods: ["google", "bing"],
    influentialFactors: ["money", "happiness"],
    primarySources: ["google", "bing"],
    engagementPreferences: ["chat", "email"],
    painPointsInEvaluation: ["money", "happiness"],
    decisionCriteria: ["money", "happiness"],
  },
  purchase: {
    decisionMakingProcess: ["money", "happiness"],
    preferredPurchasingChannels: ["example 1", "example 2"],
    influentialFactors: ["example 1", "example 2"],
    painPointsInPurchasing: ["example 1", "example 2"],
    riskConsiderations: ["example 1", "example 2"],
    supportAndAssuranceNeeds: ["example 1", "example 2"],
    expectationsPostPurchase: ["example 1", "example 2"],
  },
  implementation: {
    setupProcess: ["example 1", "example 2"],
    preferredOnboardingMethods: ["example 1", "example 2"],
    potentialBarriers: ["example 1", "example 2"],
    supportNeeds: ["example 1", "example 2"],
    resourceUtilization: ["example 1", "example 2"],
    successCriteria: ["example 1", "example 2"],
    feedbackMechanisms: ["example 1", "example 2"],
  },
  renewal: {
    renewalCriteria: ["example 1", "example 2"],
    preferredRenewalMethods: ["example 1", "example 2"],
    supportNeedsDuringRenewal: ["example 1", "example 2"],
    incentivesForRenewal: ["example 1", "example 2"],
    challengesInRenewal: ["example 1", "example 2"],
    feedbackAndImprovement: ["example 1", "example 2"],
    loyaltyAndEngagement: ["example 1", "example 2"],
  },
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/CustomerJourneyTabComponent",
  component: CustomerJourneyTabComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    currentTabInfo: { control: "object" },
    personaInformation: { control: "object" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof CustomerJourneyTabComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

//More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ProfileTab: Story = {
  args: {
    currentTabInfo: CustomerJourneyInfo[0],
    personaInformation: personaInformationExample,
  },
};

export const DiscoveryTab: Story = {
  args: {
    currentTabInfo: CustomerJourneyInfo[1],
    personaInformation: personaInformationExample,
  },
};

export const EvaluationTab: Story = {
  args: {
    currentTabInfo: CustomerJourneyInfo[2],
    personaInformation: personaInformationExample,
  },
};
