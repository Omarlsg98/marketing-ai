"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChatGetOut, ChatSendOut } from "@/types/api/chat";
import { Database } from "@/types/supabase";
import { useEffect, useRef, useState } from "react";

type Message = Database["public"]["Tables"]["llm_messages"]["Row"];
type Question = Database["public"]["Tables"]["questions"]["Row"];
type Event = React.ChangeEvent<HTMLInputElement>;
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

const Input = ({ value, onChange, placeholder, className, type = "text" , handleKeyDown}:
    {
        value: string;
        onChange: (e: Event) => void;
        placeholder: string;
        className: string;
        type: string | undefined;
        handleKeyDown: (e: KeyboardEvent) => void;
    }
) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    onKeyDown={handleKeyDown}
  />
);

const Textarea = ({ value, onChange, placeholder, className, handleKeyDown }: {
    value: string;
    onChange: (e: Event) => void;
    placeholder: string;
    className: string;
    handleKeyDown: (e: KeyboardEvent) => void;
}
) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    rows={4}
    onKeyDown={handleKeyDown}
  />
);

const SelectableChip = ({ label, selected, onClick }: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) => (
  <Button
    variant={selected ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className="m-1"
  >
    {label}
  </Button>
);

export default function Component({ params }: { params: { chatId: string } }) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [selectedChips, setSelectedChips] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (conversation.length === 0) {
      fetchChatData();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isAiTyping]);

  useEffect(() => {
    if (currentQuestion?.q_type === "multi-select") {
      setUserInput(selectedChips.join("&&"));
    }
  }, [selectedChips, currentQuestion]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const fetchChatData = async () => {
    const response = await fetch(`/api/chat/${params.chatId}`);
    const data: ChatGetOut= (await response.json());

    console.log('initial',data.progress);
    setProgress(data.progress);
    setConversation(data.output);
    setCurrentQuestion(data.lastQuestion);
    setOptions(data.options || []);
    setLoading(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleUserInput(userInput);
    }
  };

  const handleUserInput = async (input:any) => {
    let content;
    if (Array.isArray(input)) {
      content = input.join("&&");
    } else if (typeof input === "object" && input.selected && input.text) {
      content = `${input.selected.join("&&")}. Additional info: ${input.text}`;
    } else {
      content = input;
    }

    if (!content|| content.trim() === ""|| isAiTyping) return;

    const userMessage = { role: "user", content, error: false };
    setConversation((prev) => [...prev, userMessage]);
        
    setIsAiTyping(true);
    setUserInput("");
    setSelectedChips([]);
    setSelectedJobTitle("");

    const response = await fetch(`/api/chat/${params.chatId}/send`, {
      method: "POST",
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok) {
        userMessage.error = true;
        setConversation((prev) => [...prev.slice(0,-1),
            userMessage
        ]);
        
        //comunicate error to user with a toast
        const errorMessage = await response.text();
        console.error(errorMessage);
        return;
    }
    
    const data:ChatSendOut = await response.json();

    console.log('send', data.progress);
    setProgress(data.progress);
    setConversation((prev) => [...prev, { role: data.output.role, content: data.output.content }]);
    setCurrentQuestion(data.question);
    setOptions(data.options || []);
    setIsAiTyping(false);
  };

  const renderInputField = () => {
    if (!currentQuestion) return null;

    const isSubmitDisabled =
      !userInput &&
      currentQuestion.q_type !== "select" &&
      currentQuestion.q_type !== "multi-select" &&
      //currentQuestion.type !== "multiselect-textarea" &&
      !selectedJobTitle;

    const iDontKnowButton = (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleUserInput("I don't know")}
        className="border-muted hover:bg-muted/50"
      >
        I don't know
      </Button>
    );

    switch (currentQuestion.q_type) {
      case "number":
        return (
          <div className="flex flex-col space-y-4">
            <Input
              value={userInput}
              onChange={(e: Event) => setUserInput(e.target.value)}
              placeholder="10, 100, 1000..."
              type="number"
              className="my-4"
              handleKeyDown={handleKeyDown}
            />
            <div className="flex justify-between mt-2">
              {iDontKnowButton}
              <Button
                onClick={() => handleUserInput(userInput)}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        );
        
      case "text":
        if (options.length > 0) {
          return (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap">
                {options.map((suggestion) => (
                  <SelectableChip
                    key={suggestion}
                    label={suggestion}
                    selected={selectedJobTitle === suggestion}
                    onClick={() => {
                      setSelectedJobTitle(suggestion);
                      setUserInput(suggestion);
                    }}
                  />
                ))}
              </div>
              <Input
                value={userInput}
                onChange={(e: Event) => {
                  setUserInput(e.target.value);
                  setSelectedJobTitle("");
                }}
                placeholder="Type your answer here or select from above"
                className="my-4"
                handleKeyDown={handleKeyDown}
                type="text"
              />
              <div className="flex justify-between mt-2">
                {iDontKnowButton}
                <Button
                  onClick={() => handleUserInput(userInput)}
                  disabled={isSubmitDisabled}
                >
                  Submit
                </Button>
              </div>
            </div>
          );
        }
      // Fall through for text inputs without suggestions
      case "multiline":
        const InputComponent =
          currentQuestion.q_type === "text" ? Input : Textarea;
        return (
          <div className="flex flex-col space-y-4">
            <InputComponent
              value={userInput}
              onChange={(e:Event) => setUserInput(e.target.value)}
              placeholder="Type your answer here"
              className="my-4"
              handleKeyDown={handleKeyDown}
              type="text"
            />
            <div className="flex justify-between mt-2">
              {iDontKnowButton}
              <Button
                onClick={() => handleUserInput(userInput)}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      case "select":
        return (
          <div className="flex flex-col space-y-4">
            <Select onValueChange={(value) => handleUserInput(value)}>
              <SelectTrigger className="my-4">
                <SelectValue placeholder={currentQuestion.question} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between mt-2">{iDontKnowButton}</div>
          </div>
        );
      case "multi-select":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap">
              {options.map((option) => (
                <SelectableChip
                  key={option}
                  label={option}
                  selected={selectedChips.includes(option)}
                  onClick={() => {
                    setSelectedChips((prev) =>
                      prev.includes(option)
                        ? prev.filter((item) => item !== option)
                        : [...prev, option]
                    );
                  }}
                />
              ))}
            </div>
            <Textarea
              value={userInput}
              onChange={(e: Event) => setUserInput(e.target.value)}
              placeholder='Selected options will appear here. Feel free to add more details'
              className="my-4"
              handleKeyDown={handleKeyDown}
            />
            <p className="text-sm text-muted-foreground">
              Tip: You can edit the text above to add more details or custom answers.
            </p>
            <div className="flex justify-between mt-2">
              {iDontKnowButton}
              <Button
                onClick={() =>
                  handleUserInput({ selected: selectedChips, text: userInput })
                }
                disabled={selectedChips.length === 0 && !userInput.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleViewPersona = () => {
    // Here you would typically navigate to a new page or open a modal to display the persona
    alert("Viewing persona (This is a placeholder action)");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-6 m-4 rounded-lg">
        <h1 className="text-2xl font-bold">Customer Persona Development</h1>
        <Progress value={progress} className="w-full mt-2" />
      </header>
      <main className="flex-1 overflow-hidden p-4 flex flex-col">
        {
            loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-primary">Loading...</div>
                </div>
            )
        }
        <ScrollArea
          className="flex-1 mb-4 bg-white rounded-lg shadow-sm overflow-hidden"
          ref={scrollAreaRef}
        >
          <div className="p-6">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "assistant"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
                ${message.error ? "text-red-500" : ""}
                `}
              >
                <strong>{message.role === "assistant" ? "Ethan: " : "You: "}</strong>
                {message.content} {message.error && "(Something went wrong...)"}
              </div>
            ))}
            {isAiTyping && (
              <div className="text-primary">Ethan is typing...</div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto pt-4 border-t bg-white rounded-lg shadow-sm p-6">
          { progress < 100 ? (
            renderInputField()
          ) : (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleViewPersona}
                className="bg-green-500 hover:bg-green-600"
              >
                View Persona
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
