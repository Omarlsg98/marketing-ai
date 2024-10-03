import PlaceholderUI from "@/components/general/PlaceholderPage";
import type { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Pages/Placeholder",
    component: PlaceholderUI,
    parameters: {
      // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
      layout: "fullscreen",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
    },
  } satisfies Meta<typeof PlaceholderUI>;
  
  export default meta;
  type Story = StoryObj<typeof meta>;
  
  //More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
  export const Base: Story = {
    args: {
        pageName: "Account Settings",
    },
  };

  // Setting the path used to navigate to this story using nextjs
  export const NoArgs: Story = {
    args: {
       
    },
    parameters: {
      nextjs: {
        appDirectory: true,
        navigation: {
          pathname: '/asdasdasd/games'
        }
      }
    },
  };