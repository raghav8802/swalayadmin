import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// Define the types for the props
interface ConfirmationDialogProps {
  show: boolean;
  onClose: () => void; // Add onClose for closing the dialog
  onContinue: () => void;
  confrimationText?: string; // Optional text for the confrimation button
  triggerText?: string; // Optional text for the trigger button
  title?: string; // Optional title for the dialog
  description?: string; // Optional description for the dialog
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  show,
  onClose,
  onContinue,
  confrimationText="Continue",
  triggerText = "Show Dialog",
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
}) => {
  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onContinue();
              // Optionally close the dialog after confirming
              onClose();
            }}
          >
            {confrimationText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
