"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the type for our persona data
type PersonaData = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  companySize: string;
  industry: string;
  age: number;
  income: string;
  workExperience: string;
  education: string;
  decisionMaking: string;
  likesAndDislikes: string;
  mediaConsumption: string;
  habitsAndSkills: string;
  researchMethods: string;
  technologyLandscape: string;
  buyingPower: string;
  purchasingProcess: string;
  aboutMe: string;
  discoveryGoals: string;
  discoveryThoughts: string;
  discoveryActions: string;
  discoveryTouchpoints: string;
  discoveryResponse: string;
  discoveryRecommendations: string;
  evaluationGoals: string;
  evaluationThoughts: string;
  evaluationActions: string;
  evaluationTouchpoints: string;
  evaluationResponse: string;
  evaluationRecommendations: string;
  purchaseGoals: string;
  purchaseThoughts: string;
  purchaseActions: string;
  purchaseTouchpoints: string;
  purchaseResponse: string;
  purchaseRecommendations: string;
  implementationGoals: string;
  implementationThoughts: string;
  implementationActions: string;
  implementationTouchpoints: string;
  implementationResponse: string;
  implementationRecommendations: string;
  supportGoals: string;
  supportThoughts: string;
  supportActions: string;
  supportTouchpoints: string;
  supportResponse: string;
  supportRecommendations: string;
};

// Static persona data (replace this with Supabase data fetching in the future)
const personaData: PersonaData = {
  id: "1",
  name: "Sarah Thompson",
  role: "Marketing Director",
  company: "TechGrow Inc.",
  location: "Chicago, IL",
  companySize: "200-500 employees",
  industry: "B2B SaaS",
  age: 38,
  income: "$120,000 - $150,000 per year",
  workExperience: "12+ years in marketing, 5 years in current role",
  education: "MBA in Marketing, Bachelor's in Business Administration",
  decisionMaking:
    "Data-driven, collaborative, seeks input from team and stakeholders",
  likesAndDislikes:
    "Likes: Automation, analytics, ROI-focused strategies. Dislikes: Manual processes, siloed data, unclear metrics",
  mediaConsumption:
    "Regularly reads marketing blogs, attends webinars, follows thought leaders on LinkedIn",
  habitsAndSkills:
    "Strong project management, data analysis, and team leadership skills. Habit of staying updated with industry trends",
  researchMethods:
    "Vendor comparison websites, peer recommendations, case studies, free trials",
  technologyLandscape:
    "CRM system, email marketing tool, social media management platform, analytics tools",
  buyingPower:
    "Key decision-maker for marketing technology purchases, needs C-suite approval for large investments",
  purchasingProcess:
    "Identifies need, researches solutions, creates shortlist, conducts demos, presents to stakeholders, negotiates terms",
  aboutMe:
    "As the Marketing Director at TechGrow Inc., I'm responsible for driving our company's marketing strategy and growth initiatives. With over 10 years of experience in B2B marketing, I'm always looking for innovative ways to improve our marketing efficiency and ROI. My team and I are currently exploring marketing automation solutions to streamline our processes and better nurture leads through the sales funnel. We're aiming to integrate our various marketing channels and gain deeper insights into our campaign performance. In my free time, I enjoy attending marketing conferences, reading industry blogs, and mentoring aspiring marketers. I'm passionate about data-driven decision making and creating personalized customer experiences.",
  discoveryGoals:
    "Identify marketing automation solutions that can integrate multiple channels and provide advanced analytics",
  discoveryThoughts:
    "We need to streamline our marketing processes and get better insights into our campaign performance.",
  discoveryActions:
    "Researching online, reading blog posts and whitepapers, watching product demo videos",
  discoveryTouchpoints:
    "Company website, blog posts, social media ads, industry forums, peer recommendations",
  discoveryResponse:
    "Excited about possibilities, but overwhelmed by options and concerned about implementation challenges",
  discoveryRecommendations:
    "Provide clear, concise information about product features and benefits. Offer easy-to-access resources like whitepapers and case studies",
  evaluationGoals:
    "Compare top solutions, understand pricing models, and evaluate integration capabilities",
  evaluationThoughts:
    "Which solution will best fit our needs and provide the most value for our investment?",
  evaluationActions:
    "Requesting demos, creating comparison spreadsheets, discussing options with team members",
  evaluationTouchpoints:
    "Product demos, sales representatives, customer support, pricing pages, integration documentation",
  evaluationResponse:
    "Cautiously optimistic, but concerned about potential disruptions to current workflows",
  evaluationRecommendations:
    "Offer personalized demos, provide clear pricing information, highlight integration capabilities and customer support options",
  purchaseGoals:
    "Select the best marketing automation solution and gain approval from C-suite",
  purchaseThoughts:
    "This solution seems to be the best fit, but I need to ensure it will deliver ROI and get buy-in from the executive team.",
  purchaseActions:
    "Preparing presentation for C-suite, negotiating contract terms, planning implementation timeline",
  purchaseTouchpoints:
    "Sales team, contract documents, ROI calculators, implementation plans",
  purchaseResponse:
    "Excited about potential improvements, but anxious about making the right decision and justifying the investment",
  purchaseRecommendations:
    "Provide clear ROI projections, offer flexible contract terms, and present a detailed implementation plan to ease concerns",
  implementationGoals:
    "Successfully integrate the new marketing automation solution with minimal disruption to current operations",
  implementationThoughts:
    "I hope this implementation goes smoothly and we can start seeing results soon.",
  implementationActions:
    "Coordinating with IT team, migrating data, setting up integrations, training team members",
  implementationTouchpoints:
    "Implementation team, customer support, training resources, user guides",
  implementationResponse:
    "Mixture of excitement and stress, focused on ensuring a smooth transition",
  implementationRecommendations:
    "Provide dedicated implementation support, offer comprehensive training resources, and set clear milestones for success",
  supportGoals:
    "Maximize the value of the marketing automation solution and demonstrate ROI to justify renewal",
  supportThoughts:
    "How can we leverage this tool to its full potential? Is it delivering the expected value?",
  supportActions:
    "Monitoring key metrics, seeking advanced features, requesting support for complex use cases",
  supportTouchpoints:
    "Customer success manager, support tickets, user community, product updates",
  supportResponse:
    "Satisfied with improvements, but always looking for ways to extract more value",
  supportRecommendations:
    "Provide proactive customer success support, share best practices and use cases, offer advanced training for power users",
};

export default function Component() {
  // Use the static persona data
  const persona = personaData;

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="bg-[#a8d8e0] p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{persona.name}</h2>
              <p className="text-gray-600">{persona.role}</p>
            </div>
            <div className="space-x-2">
              <Button>Edit Profile</Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col lg:flex-row gap-6">
            {/* Left column: Persona's image and info */}
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <Card className="mb-6 overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt={`${persona.name} portrait`}
                  className="h-[400px] w-full object-cover"
                />
              </Card>
              <Card className="p-6">
                <h2 className="mb-2 text-2xl font-bold">{persona.name}</h2>
                <p className="mb-4 text-sm text-gray-500">
                  {persona.role} at {persona.company}
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Location:</strong> {persona.location}
                  </p>
                  <p>
                    <strong>Company Size:</strong> {persona.companySize}
                  </p>
                  <p>
                    <strong>Industry:</strong> {persona.industry}
                  </p>
                </div>
              </Card>
            </div>

            {/* Right column: About Me */}
            <div className="w-full lg:flex-1 lg:min-w-[400px]">
              <Card className="h-full p-6">
                <h2 className="mb-4 text-2xl font-bold">About Me</h2>
                <div className="space-y-4 text-gray-600">
                  <p>{persona.aboutMe}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList aria-label="Persona details">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="pre-purchase">Pre-Purchase</TabsTrigger>
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="post-purchase">Post-Purchase</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Demographics (who they are)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Age</h4>
                      <p>{persona.age} years old</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Income</h4>
                      <p>{persona.income}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Work Experience</h4>
                      <p>{persona.workExperience}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Psychographics (how they think)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Education</h4>
                      <p>{persona.education}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Decision Making</h4>
                      <p>{persona.decisionMaking}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Likes & Dislikes</h4>
                      <p>{persona.likesAndDislikes}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Behavioral (what they do)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Media Consumption</h4>
                      <p>{persona.mediaConsumption}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Habits & Skills</h4>
                      <p>{persona.habitsAndSkills}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Research Methods</h4>
                      <p>{persona.researchMethods}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Environment (where they operate)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Technology Landscape</h4>
                      <p>{persona.technologyLandscape}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Buying Power</h4>
                      <p>{persona.buyingPower}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Purchasing Process</h4>
                      <p>{persona.purchasingProcess}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pre-purchase">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Discovery/Research Phase
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Customer Goals</h4>
                      <p>{persona.discoveryGoals}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Thoughts</h4>
                      <p>{persona.discoveryThoughts}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Actions</h4>
                      <p>{persona.discoveryActions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Touchpoints</h4>
                      <p>{persona.discoveryTouchpoints}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Overall Customer Response
                      </h4>
                      <p>{persona.discoveryResponse}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommendations</h4>
                      <p>{persona.discoveryRecommendations}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Evaluation/Comparison Phase
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Customer Goals</h4>
                      <p>{persona.evaluationGoals}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Thoughts</h4>
                      <p>{persona.evaluationThoughts}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Actions</h4>
                      <p>{persona.evaluationActions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Touchpoints</h4>
                      <p>{persona.evaluationTouchpoints}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Overall Customer Response
                      </h4>
                      <p>{persona.evaluationResponse}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommendations</h4>
                      <p>{persona.evaluationRecommendations}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="purchase">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Decision/Purchase Phase
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Customer Goals</h4>
                    <p>{persona.purchaseGoals}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Customer Thoughts</h4>
                    <p>{persona.purchaseThoughts}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Customer Actions</h4>
                    <p>{persona.purchaseActions}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Touchpoints</h4>
                    <p>{persona.purchaseTouchpoints}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Overall Customer Response</h4>
                    <p>{persona.purchaseResponse}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Recommendations</h4>
                    <p>{persona.purchaseRecommendations}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="post-purchase">
              <div className="space-y-6 pb-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Implementation Phase
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Customer Goals</h4>
                      <p>{persona.implementationGoals}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Thoughts</h4>
                      <p>{persona.implementationThoughts}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Actions</h4>
                      <p>{persona.implementationActions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Touchpoints</h4>
                      <p>{persona.implementationTouchpoints}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Overall Customer Response
                      </h4>
                      <p>{persona.implementationResponse}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommendations</h4>
                      <p>{persona.implementationRecommendations}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Support/Renewal Phase
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Customer Goals</h4>
                      <p>{persona.supportGoals}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Thoughts</h4>
                      <p>{persona.supportThoughts}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Customer Actions</h4>
                      <p>{persona.supportActions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Touchpoints</h4>
                      <p>{persona.supportTouchpoints}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        Overall Customer Response
                      </h4>
                      <p>{persona.supportResponse}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommendations</h4>
                      <p>{persona.supportRecommendations}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
