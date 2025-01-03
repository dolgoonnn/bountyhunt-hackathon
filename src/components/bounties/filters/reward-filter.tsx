"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RewardFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  max: number;
}

export function RewardFilter({ value, onChange, max }: RewardFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Reward Range (ETH)</Label>
      <Slider
        min={0}
        max={max}
        step={0.1}
        value={value}
        onValueChange={onChange as (value: number[]) => void}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{value[0]} ETH</span>
        <span>{value[1]} ETH</span>
      </div>
    </div>
  );
}
