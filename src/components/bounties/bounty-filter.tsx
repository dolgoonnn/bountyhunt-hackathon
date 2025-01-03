"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./filters/status-filter";
import { RewardFilter } from "./filters/reward-filter";
import { EducationalFilter } from "./filters/education-only";
import { type BountyStatus } from "@prisma/client";
import { useState } from "react";

interface Filters {
  status: BountyStatus | "ALL";
  rewardRange: [number, number];
  isEducational: boolean | null;
}

export function BountyFilters() {
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    rewardRange: [0, 10],
    isEducational: null,
  });

  const resetFilters = () => {
    setFilters({
      status: "ALL",
      rewardRange: [0, 10],
      isEducational: null,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <StatusFilter
          value={filters.status}
          onChange={(status) => setFilters({ ...filters, status })}
        />

        <RewardFilter
          value={filters.rewardRange}
          onChange={(rewardRange) => setFilters({ ...filters, rewardRange })}
          max={10}
        />

        <EducationalFilter
          value={filters.isEducational}
          onChange={(isEducational) =>
            setFilters({ ...filters, isEducational })
          }
        />

        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}
