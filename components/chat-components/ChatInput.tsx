"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Paperclip, Send, Upload, X } from "lucide-react";
import { ChangeEvent, DragEvent, KeyboardEvent, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const ALLOWED_FILE_TYPES =
  ".png,.jpg,.jpeg,.svg,.txt,.doc,.docx,.xls,.xlsx,.pdf";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ChatInput({ onSendMessage, onFileUpload, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      await onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
      showToast("Invalid file type. Please upload a supported file type.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast("File too large. Please upload a file smaller than 10MB.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setIsDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  return (
    <div className="p-4 relative">
      {toastMessage && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 rounded-t-lg">
          {toastMessage}
        </div>
      )}
      <div
        className={`flex flex-col items-stretch rounded-lg p-2 ${isDraggingFile ? "border-2 border-dashed" : "border"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Textarea
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or drop files here..."
          className="flex-1 mb-2 border-none resize-none focus:ring-0 focus:outline-none placeholder-gray-400 active:outline-none active:ring-0"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={true}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="bg-popover p-2 rounded-md shadow-md"
                >
                  <p className="text-sm font-medium">
                    Attach a file (max 10MB)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="grid w-full gap-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${selectedFile ? "bg-secondary" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <span>{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">
                    Drag and drop a file here, or click to select a file
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={ALLOWED_FILE_TYPES}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              >
              Select File
            </Button>
            <Button onClick={handleFileUpload} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
