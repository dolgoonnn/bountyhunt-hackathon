"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type BountyStatus } from "@prisma/client";

interface StatusFilterProps {
  value: BountyStatus | "ALL";
  onChange: (value: BountyStatus | "ALL") => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ALL" id="all" />
          <Label htmlFor="all">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ACTIVE" id="active" />
          <Label htmlFor="active">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="COMPLETED" id="completed" />
          <Label htmlFor="completed">Completed</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
