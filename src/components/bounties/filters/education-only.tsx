"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EducationalFilterProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export function EducationalFilter({ value, onChange }: EducationalFilterProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-white">Educational Only</Label>
      <Switch
        checked={value === true}
        onCheckedChange={(checked) => onChange(checked ? true : null)}
      />
    </div>
  );
}
