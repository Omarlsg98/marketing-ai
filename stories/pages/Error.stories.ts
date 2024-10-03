import ErrorPage from "@/components/error-page";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ErrorPage> = {
  title: "Pages/General/Error",
  component: ErrorPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {
    statusCode: 500,
    message:
      "We're sorry, but we're having trouble processing your request. Please try again later.",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Base: Story = {
    args: {
        statusCode: 500,
        message:
          "We're sorry, but we're having trouble processing your request. Please try again later.",
      },
};

export const BadRequest: Story = {
    args: {
        statusCode: 400,
        message: "The request you made was invalid.",
      },
};

export const NotFound: Story = {
    args: {
        statusCode: 404,
        message: "The page you're looking for doesn't exist.",
      },
};

export const Unauthorized: Story = {
    args: {
        statusCode: 401,
        message: "You're not authorized to view this page.",
      },
};

export const Forbidden: Story = {
    args: {
        statusCode: 403,
        message: "You don't have permission to view this page.",
      },
};

