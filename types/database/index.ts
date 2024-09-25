/* This file is generated manually from the database schema. 
  * It is used to generate types for the API and components.
*/

import { Database } from '@/types/supabase';

export type Chat = Database['public']['Tables']['llm_chats']['Row'];
export type Message = Database['public']['Tables']['llm_messages']['Insert'];
export type Role = Database['public']['Tables']['llm_messages']['Row']['role'];
export type Table = keyof Database["public"]["Tables"];


export type PersonaInformation = {

  v1: {
    id: string;
    name: string;
    short_description: string;
    finished: boolean;
    chat_progress: number;
    primary_goal: string;
    key_challenge: string;
    main_buying_motivation: string;
    image_path: string;
    about_me: string;
    gender: string;
    ethnicity: string;
    location: string;
    occupation: string;
    profile: {
      demographics: string[];
      psychographics: string[];
      goalsPainPoints: string[];
    };
    discovery: {
      informationSeekingBehavior: string[];
      preferredContentTypes: string[];
      engagementPreferences: string[];
      influentialFactors: string[];
      primarySources: string[];
      initialExpectations: string[];
    };
    evaluation: {
      comparisonCriteria: string[];
      preferredComparisonMethods: string[];
      influentialFactors: string[];
      primarySources: string[];
      engagementPreferences: string[];
      painPointsInEvaluation: string[];
      decisionCriteria: string[];
    };
    purchase: {
      decisionMakingProcess: string[];
      preferredPurchasingChannels: string[];
      influentialFactors: string[];
      painPointsInPurchasing: string[];
      riskConsiderations: string[];
      supportAndAssuranceNeeds: string[];
      expectationsPostPurchase: string[];
    };
    implementation: {
      setupProcess: string[];
      preferredOnboardingMethods: string[];
      potentialBarriers: string[];
      supportNeeds: string[];
      resourceUtilization: string[];
      successCriteria: string[];
      feedbackMechanisms: string[];
    };
    renewal: {
      renewalCriteria: string[];
      preferredRenewalMethods: string[];
      supportNeedsDuringRenewal: string[];
      incentivesForRenewal: string[];
      challengesInRenewal: string[];
      feedbackAndImprovement: string[];
      loyaltyAndEngagement: string[];
    };
  };

  v1_short: {
    id: string;
    name: string;
    short_description: string;
    finished: boolean;
    chat_progress: number;
    primary_goal: string;
    key_challenge: string;
    main_buying_motivation: string;
    image_path: string;
  };

};
