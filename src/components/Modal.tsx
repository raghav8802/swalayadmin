'use client'
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ModalProps {
    isVisible: boolean;
    triggerLabel?: string;
    title?: string;
    description?: string;
    onSave: () => void;
    onClose: () => void;
    children: ReactNode;

}

export function Modal({
    isVisible,
    triggerLabel = "Open Modal",
    title = "Modal Title",
    description = "",
    onSave,
    onClose,
    children,
}: ModalProps) {
    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button variant="outline">{triggerLabel}</Button>
            </DialogTrigger> */}
            {/* <DialogContent className={`sm:max-w-[650px]`}> */}
            {/* lg:max-w-screen-lg */}
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
                    <Button type="button" variant={"ghost"} onClick={onClose}>Close </Button>
                    <Button type="button" onClick={onSave}>{triggerLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
