"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "./filters/status-filter";
import { RewardFilter } from "./filters/reward-filter";
import { EducationalFilter } from "./filters/education-only";
import { type BountyStatus } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

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

  const [isExpanded, setIsExpanded] = useState(true);

  const resetFilters = () => {
    setFilters({
      status: "ALL",
      rewardRange: [0, 10],
      isEducational: null,
    });
  };

  const hasActiveFilters = 
    filters.status !== "ALL" || 
    filters.rewardRange[0] !== 0 || 
    filters.rewardRange[1] !== 10 || 
    filters.isEducational !== null;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-gray-700/50">
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-gray-200">Filters</h3>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-200 hover:text-gray-200 transition-colors"
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg bg-gray-800/50 p-4"
              >
                <StatusFilter
                  value={filters.status}
                  onChange={(status) => setFilters({ ...filters, status })}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg bg-gray-800/50 p-4"
              >
                <RewardFilter
                  value={filters.rewardRange}
                  onChange={(rewardRange) => setFilters({ ...filters, rewardRange })}
                  max={10}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg bg-gray-800/50 p-4"
              >
                <EducationalFilter
                  value={filters.isEducational}
                  onChange={(isEducational) =>
                    setFilters({ ...filters, isEducational })
                  }
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  className={`w-full group transition-all duration-300 
                    ${hasActiveFilters 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 hover:border-pink-500/50' 
                      : 'bg-gray-200/50 border-gray-100/50'}`}
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  <RotateCcw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  Reset Filters
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}