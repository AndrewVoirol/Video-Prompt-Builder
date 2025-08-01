/**
 * @fileoverview Tests for PromptBuilder component
 * @description Example component test demonstrating testing patterns for Video-Prompt-Builder
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";

// Mock the PromptBuilder component since it may not exist yet
// In a real scenario, you would import the actual component
interface MockPromptBuilderProps {
  onPromptChange?: (prompt: string) => void;
  onSubmit?: (prompt: string) => void;
}

const MockPromptBuilder = ({
  onPromptChange,
  onSubmit,
}: MockPromptBuilderProps) => {
  const [prompt, setPrompt] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    onPromptChange?.(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit?.(prompt);
  };

  return (
    <div data-testid="prompt-builder">
      <h1>Video Prompt Builder</h1>
      <textarea
        data-testid="prompt-input"
        value={prompt}
        onChange={handleChange}
        placeholder="Enter your video prompt..."
        aria-label="Video prompt input"
      />
      <button
        data-testid="submit-button"
        onClick={handleSubmit}
        disabled={!prompt.trim()}
      >
        Generate Video
      </button>
      <div data-testid="prompt-preview">
        {prompt && <p>Preview: {prompt}</p>}
      </div>
    </div>
  );
};

// Test suite for PromptBuilder component
describe("PromptBuilder Component", () => {
  // Mock functions for callbacks
  const mockOnPromptChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    // Clear mocks before each test
    mockOnPromptChange.mockClear();
    mockOnSubmit.mockClear();
  });

  test("renders the component with initial state", () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByTestId("prompt-builder")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /video prompt builder/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/video prompt input/i)).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  test("updates prompt text when user types", async () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText(/video prompt input/i);
    const testPrompt = "A beautiful sunset over the ocean";

    fireEvent.change(input, { target: { value: testPrompt } });

    expect(input).toHaveValue(testPrompt);
    expect(mockOnPromptChange).toHaveBeenCalledWith(testPrompt);
    expect(screen.getByText(`Preview: ${testPrompt}`)).toBeInTheDocument();
  });

  test("enables submit button when prompt is entered", () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText(/video prompt input/i);
    const submitButton = screen.getByTestId("submit-button");

    expect(submitButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "Test prompt" } });

    expect(submitButton).toBeEnabled();
  });

  test("calls onSubmit when submit button is clicked", () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText(/video prompt input/i);
    const submitButton = screen.getByTestId("submit-button");
    const testPrompt = "A cinematic video of a bustling city";

    fireEvent.change(input, { target: { value: testPrompt } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(testPrompt);
  });

  test("handles empty prompt correctly", () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText(/video prompt input/i);
    const submitButton = screen.getByTestId("submit-button");

    // Add some text then clear it
    fireEvent.change(input, { target: { value: "Test" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(submitButton).toBeDisabled();
    expect(screen.queryByTestId("prompt-preview")).toBeInTheDocument();
    expect(screen.queryByText(/preview:/i)).not.toBeInTheDocument();
  });

  test("handles whitespace-only prompts", () => {
    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText(/video prompt input/i);
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(input, { target: { value: "   " } });

    expect(submitButton).toBeDisabled();
  });
});

// Integration test example
describe("PromptBuilder Integration", () => {
  test("complete user workflow", async () => {
    const mockOnPromptChange = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <MockPromptBuilder
        onPromptChange={mockOnPromptChange}
        onSubmit={mockOnSubmit}
      />,
    );

    // User types a prompt
    const input = screen.getByLabelText(/video prompt input/i);
    const prompt = "A time-lapse of flowers blooming in spring";

    fireEvent.change(input, { target: { value: prompt } });

    // Verify callback is called
    expect(mockOnPromptChange).toHaveBeenCalledWith(prompt);

    // Verify preview appears
    await waitFor(() => {
      expect(screen.getByText(`Preview: ${prompt}`)).toBeInTheDocument();
    });

    // User submits the prompt
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Verify submission
    expect(mockOnSubmit).toHaveBeenCalledWith(prompt);
  });
});
