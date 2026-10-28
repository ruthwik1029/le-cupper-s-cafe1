"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function LogoPreviewDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Le Cuppers Cafe
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Official Brand Mark · ESTD. 2018
          </DialogDescription>
        </DialogHeader>
        <div className="relative mx-auto mt-2 flex aspect-square w-full max-w-[320px] items-center justify-center rounded-2xl bg-muted/30 p-4 sm:max-w-[360px]">
          <Image
            src="/logo.png"
            alt="Official Le Cuppers Cafe Logo"
            width={512}
            height={512}
            className="h-full w-full object-contain drop-shadow-sm select-none"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
