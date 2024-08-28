"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import CustomerJourneyDiscovery from "@/components/customer-journey/CustomerJourneyDiscovery";
import CustomerJourneyEvaluation from "@/components/customer-journey/CustomerJourneyEvaluation";
import CustomerJourneyPostPurchase from "@/components/customer-journey/CustomerJourneyPostPurchase";
import CustomerJourneyProfile from "@/components/customer-journey/CustomerJourneyProfile";
import CustomerJourneyPurchase from "@/components/customer-journey/CustomerJourneyPurchase";

import { PersonaInformation } from "@/types/persona";
type TabName =
  | "profile"
  | "discovery"
  | "evaluation"
  | "purchase"
  | "post-purchase";

export default function Component({
  params,
}: {
  params: { personaId: string };
}) {
  const [personaImage, setPersonaImage] = useState(
    "/placeholder.svg?height=400&width=400"
  );
  const [personaInformation, setPersonaInformation] = useState<
    PersonaInformation["v1"]
  >({
    id: "",
    name: "John Doe",
    short_description: "Tech enthusiast and software engineer",
    finished: false,
    chat_progress: 0,
    primary_goal: "...",
    key_challenge: "...",
    main_buying_motivation: "...",
    image_path: "",
    about_me: "I'm your wonderful persona... loading..",
  });

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("profile");
  const [imageGenOptions, setImageGenOptions] = useState({
    ethnicity: "",
    style: "realistic",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch persona image
    const fetchPersona = async () => {
      const response = await fetch(`/api/persona/${params.personaId}`);
      const data = await response.json();
      setPersonaImage(data.imageUrl);
      setPersonaInformation(data.output);
    };

    fetchPersona();
  }, [params.personaId]);

  const updateImage: (
    update_mode: "image_upload" | "image_generate",
    file: File | null,
    ethnicity: string | null,
    style: string | null
  ) => Promise<string> = async (update_mode, file, ethnicity, style) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("update_mode", update_mode);
    formData.append("chat_id", params.personaId);
    formData.append("id", params.personaId);
    formData.append("ethnicity", ethnicity);
    formData.append("style", style);

    const repsonse = await fetch(`/api/persona/${params.personaId}/image`, {
      method: "POST",
      body: formData,
    });

    if (repsonse.ok) {
      console.log("Image uploaded successfully");
    } else {
      console.error("Error uploading image");
    }

    const data = await repsonse.json();
    const signedUrl = data.output;
    console.log("Generated image:", signedUrl);
    return signedUrl;
  };

  const generateNewImage = async () => {
    setIsGeneratingImage(true);
    console.log("Generating image with options:", imageGenOptions);
    const signedUrl = await updateImage(
      "image_generate",
      null,
      imageGenOptions.ethnicity,
      imageGenOptions.style
    );
    setPersonaImage(signedUrl);
    setIsGeneratingImage(false);
    setIsImagePopupOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const signedUrl = await updateImage("image_upload", file, null, null);
      setPersonaImage(signedUrl);
      event.target.files = null;
    }
  };

  const tabContent: Record<TabName, React.ReactNode> = {
    profile: <CustomerJourneyProfile personaInformation={personaInformation} />,
    discovery: (
      <CustomerJourneyDiscovery personaInformation={personaInformation} />
    ),
    evaluation: (
      <CustomerJourneyEvaluation personaInformation={personaInformation} />
    ),
    purchase: (
      <CustomerJourneyPurchase personaInformation={personaInformation} />
    ),
    "post-purchase": (
      <CustomerJourneyPostPurchase personaInformation={personaInformation} />
    ),
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg">
      <div className="p-6">
        <div className="mb-6 flex flex-col lg:flex-row gap-6">
          {/* Left column: Persona's image and info */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="mb-4 overflow-hidden rounded-lg shadow">
              <img
                src={personaImage}
                alt="Persona portrait"
                className="h-96 w-full object-cover"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <Button
                className="flex-1"
                onClick={() => setIsImagePopupOpen(true)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Image
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleUploadClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-2 text-2xl font-bold">
                {personaInformation.name}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {personaInformation.short_description}
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Gender:</strong> Male
                </p>
                <p>
                  <strong>Ethnicity:</strong> Caucasian
                </p>
                <p>
                  <strong>Location:</strong> San Francisco, USA
                </p>
                <p>
                  <strong>Occupation:</strong> Software Engineer
                </p>
              </div>
            </div>
          </div>

          {/* Right column: About Me */}
          <div className="w-full lg:flex-1 lg:min-w-[400px]">
            <div className="h-full p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold">About Me</h2>
              <div className="space-y-4 text-muted-foreground">
                {personaInformation.about_me &&
                  personaInformation.about_me
                    .split("\n")
                    .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap bg-muted p-1 rounded-lg">
            {(
              [
                "profile",
                "discovery",
                "evaluation",
                "purchase",
                "post-purchase",
              ] as TabName[]
            ).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "ghost"}
                className="flex-grow sm:flex-grow-0"
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>

      {/* Image Generation Popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Generate New Persona Image
            </h2>
            <p className="mb-4 text-muted-foreground">
              Customize the options below to generate a new image for your
              persona.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="ethnicity"
                  className="block text-sm font-medium mb-1"
                >
                  Ethnicity
                </label>
                <Input
                  id="ethnicity"
                  value={imageGenOptions.ethnicity}
                  onChange={(e) =>
                    setImageGenOptions({
                      ...imageGenOptions,
                      ethnicity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="style"
                  className="block text-sm font-medium mb-1"
                >
                  Style
                </label>
                <Select
                  disabled={true}
                  value={imageGenOptions.style}
                  onValueChange={(value) =>
                    setImageGenOptions({ ...imageGenOptions, style: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsImagePopupOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={generateNewImage} disabled={isGeneratingImage}>
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
