"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

type TabName =
  | "overview"
  | "description"
  | "targeting"
  | "demographics"
  | "visualisation";

export default function Component() {
  const [activeTab, setActiveTab] = useState<TabName>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
    "system"
  );

  const PersonaOverview = () => (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-gray-800">
        Persona Overview
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Key insights and visualisations for your user personas
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            name: "Frugal Francesca",
            type: "Young Professional",
            coverage: 40,
          },
          { name: "Busy Becca", type: "Busy Parent", coverage: 35 },
          {
            name: "Trendsetter Tara",
            type: "Tech-Savvy Enthusiast",
            coverage: 25,
          },
        ].map((persona, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#E1E0E5] overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-grow">
              <div className="flex h-full">
                <div className="w-1/2 flex flex-col justify-center">
                  <h5 className="text-base font-semibold text-gray-700 mb-1">
                    Persona Coverage
                  </h5>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {persona.coverage}%
                  </div>
                  <p className="text-sm text-gray-500">Of Customer Base</p>
                </div>
                <div className="w-px bg-[#E1E0E5] self-stretch mx-4"></div>
                <div className="w-1/2 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mb-3"></div>
                  <h6 className="text-sm font-semibold text-gray-900 text-center">
                    {persona.name}
                  </h6>
                  <p className="text-xs text-gray-500 text-center">
                    Persona: {persona.type}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#E1E0E5] p-4 h-14 flex items-center">
              <button className="text-blue-600 hover:text-blue-800">
                View details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabContent: Record<TabName, ReactNode> = {
    overview: <PersonaOverview />,
    description: (
      <p>This tab contains detailed descriptions of each persona.</p>
    ),
    targeting: <p>Information about how to target each persona effectively.</p>,
    demographics: <p>Demographic information for each persona.</p>,
    visualisation: <p>Visual representations of persona data and insights.</p>,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg">
      <div className="p-4">
        {/* Customer Insights */}
        <section className="bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Customer Insights
              </h3>
              <p className="text-sm text-gray-600">Schpiel about personas</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/my/personas/list">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 w-full sm:w-auto">
                  View All Personas
                </button>
              </Link>
              <Link href="/my/personas/create">
                <button className="bg-[#75C5D5] text-white px-4 py-2 rounded-md w-full sm:w-auto">
                  Create Persona
                </button>
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg border border-[#E1E0E5]">
              <h4 className="text-sm font-medium text-gray-500">
                Persona Breakdown
              </h4>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">Identified User Personas</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#E1E0E5]">
              <h4 className="text-sm font-medium text-gray-500">
                Survey Responses
              </h4>
              <div className="text-2xl font-bold">527 / 700</div>
              <p className="text-xs text-gray-500">
                Collected Survey Responses
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#8C8CE0] rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#E1E0E5]">
              <h4 className="text-sm font-medium text-gray-500">
                Persona Coverage
              </h4>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-gray-500">
                Of Target Customer Base Represented
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-[#8C8CE0] rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex bg-[#F0F4FA] p-1 rounded-lg">
              {(Object.keys(tabContent) as TabName[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#2E3650] text-white shadow"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              {tabContent[activeTab]}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
