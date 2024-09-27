import type { Meta, StoryObj } from "@storybook/react";
import PersonasGrid from "@/components/customer/persona/PersonasList";
import { PersonaList } from "@/types/components/persona";

const mockPersonas: PersonaList = [
  {
    id: "1",
    name: "John Doe",
    image_url:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    shortDescription:
      "A visionary marketing manager with a passion for innovation.",
    title: "Marketing Manager",
    whoTheyAre: "Experienced marketer looking to leverage data",
    needs: "Better analytics tools and insights",
    challenges: "Keeping up with rapidly changing digital landscape",
    isSuggestion: false,
  },
  {
    id: "2",
    name: "Jane Smith",
    image_url: null,
    shortDescription: "Entrepreneur managing a growing local business",
    title: "Small Business Owner",
    whoTheyAre: "Entrepreneur managing a growing local business",
    needs: "Efficient tools for managing operations and finances",
    challenges: "Balancing multiple responsibilities and scaling the business",
    isSuggestion: true,
  },
  {
    id: "3",
    name: "Alex Johnson",
    image_url: "/placeholder.svg?height=96&width=96",
    shortDescription: "Tech-savvy developer always learning new technologies",
    title: "Software Engineer",
    whoTheyAre: "Passionate coder with a focus on web technologies",
    needs: "Access to cutting-edge development tools and resources",
    challenges: "Keeping up with rapidly evolving frameworks and languages",
    isSuggestion: false,
  },
];

const meta: Meta<typeof PersonasGrid> = {
  title: "Pages/PersonaGrid",
  component: PersonasGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    personas: { control: "object" },
  },
  args: {
    personas: mockPersonas,
  },
};

export default meta;
type Story = StoryObj<typeof PersonasGrid>;

export const Base: Story = {
  args: {
    personas: mockPersonas,
  },
};

export const Empty: Story = {
  args: {
    personas: [],
  },
};

export const SinglePersona: Story = {
  args: {
    personas: [mockPersonas[0]],
  },
};