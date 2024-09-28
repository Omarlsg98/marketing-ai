"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";

export default function ChangeEmailUI({ oldEmail }: { oldEmail: string }) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState(oldEmail);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Changes saved:", { email });
    alert("Changes saved successfully!");
  };

  const handleEmailChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newEmail !== confirmEmail) {
      setEmailError("Emails do not match");
      return;
    }
    setEmail(newEmail);
    setIsEmailDialogOpen(false);
    setNewEmail("");
    setConfirmEmail("");
    setEmailError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-8 sm:p-10">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Email Settings
          </h1>

          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Changes to your email will apply to all your workspaces.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]"
                />
              </div>
              <Dialog
                open={isEmailDialogOpen}
                onOpenChange={setIsEmailDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm underline text-gray-500 dark:text-gray-400 hover:text-teal-400 active:text-teal-400"
                  >
                    Change your email address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription className="mb-2">
                      Enter your new email address below. You&apos;ll need to
                      confirm this change.
                    </DialogDescription>
                  </DialogHeader>
                  <Separator className="mb-4" />
                  <form onSubmit={handleEmailChange} className="space-y-4">
                    <div>
                      <Label htmlFor="newEmail">New Email Address</Label>
                      <Input
                        id="newEmail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        type="email"
                        required
                        className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmEmail">
                        Confirm New Email Address
                      </Label>
                      <Input
                        id="confirmEmail"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        type="email"
                        required
                        className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-blue-950 hover:bg-blue-900"
                      >
                        Confirm Change
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="button" variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={true} // TODO: Implement this page and enable the button
                  className="bg-blue-950 hover:bg-blue-900"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
