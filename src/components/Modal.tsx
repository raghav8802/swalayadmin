'use client'
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface ModalProps {
    isVisible: boolean;
    triggerLabel?: string;
    title?: string;
    description?: string;
    onSave: () => void;
    onClose: () => void;
    children: ReactNode;
    isLoading?: boolean;
}

export function Modal({
    isVisible,
    triggerLabel = "Open Modal",
    title = "Modal Title",
    description = "",
    onSave,
    onClose,
    children,
    isLoading = false,
}: ModalProps) {
    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
           
            <DialogContent className={"sm:max-w-[700px]  max-h-screen"}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description &&
                        <DialogDescription>
                            {description} 
                        </DialogDescription>
                    }
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {children}
                </div>
                <DialogFooter>
                    <Button type="button" variant={"ghost"} onClick={onClose} disabled={isLoading}>Close</Button>
                    <Button type="button" onClick={onSave} disabled={isLoading}>
                        {isLoading ? "Loading..." : triggerLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
