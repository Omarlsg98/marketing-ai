import { cardIcons } from "@/types/components/card";
import { PersonaInformation } from "@/types/interseed/persona";

export interface CustomerJourneyInfoInterface {
  title: string;
  dataFieldName:
    | "profile"
    | "discovery"
    | "evaluation"
    | "purchase"
    | "implementation"
    | "renewal";
  sections: {
    title: string;
    description: string;
    icon: cardIcons;
    dataFieldName:
      | keyof PersonaInformation["v1"]["profile"]
      | keyof PersonaInformation["v1"]["discovery"]
      | keyof PersonaInformation["v1"]["evaluation"]
      | keyof PersonaInformation["v1"]["purchase"]
      | keyof PersonaInformation["v1"]["implementation"]
      | keyof PersonaInformation["v1"]["renewal"];
  }[];
}

export const CustomerJourneyInfo: CustomerJourneyInfoInterface[] = [
  {
    title: "Profile",
    dataFieldName: "profile",
    sections: [
      {
        title: "Demographics",
        description:
          "Describe the persona's demographic information. Like age, location, occupation, etc.",
        icon: "user",
        dataFieldName: "demographics",
      },
      {
        title: "Psychographics",
        description: "Describe the persona's psychological characteristics.",
        icon: "brain",
        dataFieldName: "psychographics",
      },
      {
        title: "Goals & Pain Points",
        description: "Describe the persona's goals and pain points.",
        icon: "heart",
        dataFieldName: "goalsPainPoints",
      },
    ],
  },
  //DISCOVERY
  // Information Seeking Behavior: Describe how the customer searches for solutions or information related to their needs and goals.
  // Preferred Content Types: Identify the types of content the customer prefers during the discovery phase
  // Engagement Preferences: Explain how the customer prefers to engage with new information.
  // Influential Factors: List the factors that most influence the customer's perception and evaluation of potential solutions.
  // Primary Sources: Identify the primary sources of information the customer trusts and uses during the discovery phase.
  // Initial Expectations: Describe the customer's initial expectations when searching for information or solutions.
  {
    title: "Discovery",
    dataFieldName: "discovery",
    sections: [
      {
        title: "Information Seeking Behavior",
        description:
          "Describe how the customer searches for solutions or information related to their needs and goals.",
        icon: "search",
        dataFieldName: "informationSeekingBehavior",
      },
      {
        title: "Preferred Content Types",
        description:
          "Identify the types of content the customer prefers during the discovery phase",
        icon: "file",
        dataFieldName: "preferredContentTypes",
      },
      {
        title: "Engagement Preferences",
        description:
          "Explain how the customer prefers to engage with new information.",
        icon: "chat",
        dataFieldName: "engagementPreferences",
      },
      {
        title: "Influential Factors",
        description:
          "List the factors that most influence the customer's perception and evaluation of potential solutions.",
        icon: "star",
        dataFieldName: "influentialFactors",
      },
      {
        title: "Primary Sources",
        description:
          "Identify the primary sources of information the customer trusts and uses during the discovery phase.",
        icon: "book",
        dataFieldName: "primarySources",
      },
      {
        title: "Initial Expectations",
        description:
          "Describe the customer's initial expectations when searching for information or solutions.",
        icon: "lightbulb",
        dataFieldName: "initialExpectations",
      },
    ],
  },
  // EVALUATION
  // Using the information provided by the answers, generate the following details specifically for the evaluation/comparison phase of the customer journey:
  // Comparison Criteria: Describe the key criteria the customer uses to compare different products or services.
  // Preferred Comparison Methods: Identify the methods the customer prefers for comparing options (e.g., comparison charts, detailed reviews).
  // Influential Factors: List the factors that most influence the customer's choice between different options.
  // Primary Sources: Identify the primary sources of information the customer trusts and uses during the evaluation phase.
  // Engagement Preferences: Explain how the customer prefers to engage with comparison information (e.g., reading detailed reports, watching comparison videos).
  // Pain Points in Evaluation: Describe the challenges and pain points the customer faces while evaluating and comparing options.
  // Decision Criteria: Outline the criteria the customer uses to make a final decision after comparing options.
  {
    title: "Evaluation",
    dataFieldName: "evaluation",
    sections: [
      {
        title: "Comparison Criteria",
        description:
          "Describe the key criteria the customer uses to compare different products or services.",
        icon: "balance-scale",
        dataFieldName: "comparisonCriteria",
      },
      {
        title: "Preferred Comparison Methods",
        description:
          "Identify the methods the customer prefers for comparing options (e.g., comparison charts, detailed reviews).",
        icon: "chart-bar",
        dataFieldName: "preferredComparisonMethods",
      },
      {
        title: "Influential Factors",
        description:
          "List the factors that most influence the customer's choice between different options.",
        icon: "star",
        dataFieldName: "influentialFactors",
      },
      {
        title: "Primary Sources",
        description:
          "Identify the primary sources of information the customer trusts and uses during the evaluation phase.",
        icon: "book",
        dataFieldName: "primarySources",
      },
      {
        title: "Engagement Preferences",
        description:
          "Explain how the customer prefers to engage with comparison information (e.g., reading detailed reports, watching comparison videos).",
        icon: "chat",
        dataFieldName: "engagementPreferences",
      },
      {
        title: "Pain Points in Evaluation",
        description:
          "Describe the challenges and pain points the customer faces while evaluating and comparing options.",
        icon: "frown",
        dataFieldName: "painPointsInEvaluation",
      },
      {
        title: "Decision Criteria",
        description:
          "Outline the criteria the customer uses to make a final decision after comparing options.",
        icon: "check",
        dataFieldName: "decisionCriteria",
      },
    ],
  },
  //PURCHASE
  // Decision-Making Process: Outline the steps the customer goes through to make a purchase decision.
  // Preferred Purchasing Channels: Identify the channels the customer prefers to use when making a purchase (e.g., online, in-store, through a sales representative).
  // Influential Factors: List the factors that most influence the customer's purchasing decision (e.g., price, product features, brand reputation).
  // Pain Points in Purchasing: Describe the challenges and pain points the customer faces during the purchasing process.
  // Risk Considerations: Explain any concerns or risks the customer considers before making a purchase.
  // Support and Assurance Needs: Identify the types of support or assurances the customer seeks during the purchase (e.g., customer service availability, return policies).
  // Expectations Post-Purchase: State the customer's expectations immediately after making a purchase (e.g., delivery timelines, setup support).
  {
    title: "Purchase",
    dataFieldName: "purchase",
    sections: [
      {
        title: "Decision-Making Process",
        description:
          "Outline the steps the customer goes through to make a purchase decision.",
        icon: "check-square",
        dataFieldName: "decisionMakingProcess",
      },
      {
        title: "Preferred Purchasing Channels",
        description:
          "Identify the channels the customer prefers to use when making a purchase (e.g., online, in-store, through a sales representative).",
        icon: "shopping-cart",
        dataFieldName: "preferredPurchasingChannels",
      },
      {
        title: "Influential Factors",
        description:
          "List the factors that most influence the customer's purchasing decision (e.g., price, product features, brand reputation).",
        icon: "star",
        dataFieldName: "influentialFactors",
      },
      {
        title: "Pain Points in Purchasing",
        description:
          "Describe the challenges and pain points the customer faces during the purchasing process.",
        icon: "frown",
        dataFieldName: "painPointsInPurchasing",
      },
      {
        title: "Risk Considerations",
        description:
          "Explain any concerns or risks the customer considers before making a purchase.",
        icon: "exclamation-triangle",
        dataFieldName: "riskConsiderations",
      },
      {
        title: "Support and Assurance Needs",
        description:
          "Identify the types of support or assurances the customer seeks during the purchase (e.g., customer service availability, return policies).",
        icon: "life-ring",
        dataFieldName: "supportAndAssuranceNeeds",
      },
      {
        title: "Expectations Post-Purchase",
        description:
          "State the customer's expectations immediately after making a purchase (e.g., delivery timelines, setup support).",
        icon: "clock",
        dataFieldName: "expectationsPostPurchase",
      },
    ],
  },
  //Implementation
  // Setup Process: Describe how the customer approaches the setup and initial use of the product or service.
  // Preferred Onboarding Methods: Identify the methods the customer prefers for onboarding (e.g., user manuals, instructional videos, live onboarding sessions).
  // Potential Barriers: List any potential barriers or challenges the customer might face during the implementation phase.
  // Support Needs: Identify the types of support the customer seeks during implementation (e.g., technical support, customer service assistance).
  // Resource Utilization: Explain how the customer uses available resources (e.g., help centers, community forums) during the implementation phase.
  // Success Criteria: Define what successful implementation looks like from the customer's perspective.
  // Feedback Mechanisms: Describe how the customer prefers to provide feedback or report issues during the implementation phase.
  {
    title: "Implementation",
    dataFieldName: "implementation",
    sections: [
      {
        title: "Setup Process",
        description:
          "Describe how the customer approaches the setup and initial use of the product or service.",
        icon: "cogs",
        dataFieldName: "setupProcess",
      },
      {
        title: "Preferred Onboarding Methods",
        description:
          "Identify the methods the customer prefers for onboarding (e.g., user manuals, instructional videos, live onboarding sessions).",
        icon: "book",
        dataFieldName: "preferredOnboardingMethods",
      },
      {
        title: "Potential Barriers",
        description:
          "List any potential barriers or challenges the customer might face during the implementation phase.",
        icon: "ban",
        dataFieldName: "potentialBarriers",
      },
      {
        title: "Support Needs",
        description:
          "Identify the types of support the customer seeks during implementation (e.g., technical support, customer service assistance).",
        icon: "life-ring",
        dataFieldName: "supportNeeds",
      },
      {
        title: "Resource Utilization",
        description:
          "Explain how the customer uses available resources (e.g., help centers, community forums) during the implementation phase.",
        icon: "users",
        dataFieldName: "resourceUtilization",
      },
      {
        title: "Success Criteria",
        description:
          "Define what successful implementation looks like from the customer's perspective.",
        icon: "check",
        dataFieldName: "successCriteria",
      },
      {
        title: "Feedback Mechanisms",
        description:
          "Describe how the customer prefers to provide feedback or report issues during the implementation phase.",
        icon: "comments",
        dataFieldName: "feedbackMechanisms",
      },
    ],
  },
  // Renewal
  // Renewal Criteria: Describe the key factors the customer considers when deciding to renew a service or subscription.
  // Preferred Renewal Methods: Identify the methods the customer prefers for renewing services (e.g., automatic renewal, reminder emails).
  // Support Needs During Renewal: Outline the types of support the customer seeks when renewing a service (e.g., dedicated account manager, easy access to renewal options).
  // Incentives for Renewal: List any incentives or benefits that would encourage the customer to renew (e.g., discounts, added features).
  // Challenges in Renewal: Explain the potential challenges or pain points the customer might face during the renewal process.
  // Feedback and Improvement: Describe how the customer prefers to provide feedback and how they would like improvements communicated to them.
  // Loyalty and Engagement: Explain how the customer’s loyalty and engagement can be increased post-renewal (e.g., loyalty programs, personalized communication).
  {
    title: "Renewal",
    dataFieldName: "renewal",
    sections: [
      {
        title: "Renewal Criteria",
        description:
          "Describe the key factors the customer considers when deciding to renew a service or subscription.",
        icon: "redo",
        dataFieldName: "renewalCriteria",
      },
      {
        title: "Preferred Renewal Methods",
        description:
          "Identify the methods the customer prefers for renewing services (e.g., automatic renewal, reminder emails).",
        icon: "refresh",
        dataFieldName: "preferredRenewalMethods",
      },
      {
        title: "Support Needs During Renewal",
        description:
          "Outline the types of support the customer seeks when renewing a service (e.g., dedicated account manager, easy access to renewal options).",
        icon: "life-ring",
        dataFieldName: "supportNeedsDuringRenewal",
      },
      {
        title: "Incentives for Renewal",
        description:
          "List any incentives or benefits that would encourage the customer to renew (e.g., discounts, added features).",
        icon: "gift",
        dataFieldName: "incentivesForRenewal",
      },
      {
        title: "Challenges in Renewal",
        description:
          "Explain the potential challenges or pain points the customer might face during the renewal process.",
        icon: "frown",
        dataFieldName: "challengesInRenewal",
      },
      {
        title: "Feedback and Improvement",
        description:
          "Describe how the customer prefers to provide feedback and how they would like improvements communicated to them.",
        icon: "comments",
        dataFieldName: "feedbackAndImprovement",
      },
      {
        title: "Loyalty and Engagement",
        description:
          "Explain how the customer's loyalty and engagement can be increased post-renewal (e.g., loyalty programs, personalized communication).",
        icon: "heart",
        dataFieldName: "loyaltyAndEngagement",
      },
    ],
  },
];
