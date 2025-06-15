
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NamePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNameSubmit: (name: string) => void;
  title: string;
  description: string;
}

const NamePromptDialog: React.FC<NamePromptDialogProps> = ({ open, onOpenChange, onNameSubmit, title, description }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NamePromptDialog;
