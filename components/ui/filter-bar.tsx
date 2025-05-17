"use client";

import { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  placeholder?: string;
  width?: string;
  defaultValue?: string;
  options: FilterOption[];
}

interface FilterOptions {
  [key: string]: FilterConfig;
}

interface FilterBarProps {
  onFiltersChange: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
  filterOptions: FilterOptions;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export const FilterBar = ({
  onFiltersChange,
  initialFilters = {},
  filterOptions = {},
  showSearch = true,
  searchPlaceholder = "Search...",
  className = "",
}: FilterBarProps) => {
  // Initialize state with provided initial filters or empty defaults
  const [filters, setFilters] = useState<Record<string, string>>({
    search: "",
    ...initialFilters,
  });

  // Apply filters when component mounts with initial values
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  // Handle select filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: value };
      // Notify parent component about filter changes
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  // Reset all filters to defaults
  const handleResetFilters = () => {
    const defaultFilters: Record<string, string> = {};
    
    // Set default values for each filter
    Object.keys(filterOptions).forEach((filterName) => {
      // Use first option as default or specified default
      const options = filterOptions[filterName].options || [];
      defaultFilters[filterName] = filterOptions[filterName].defaultValue || 
                                  (options.length > 0 ? options[0].value : "");
    });
    
    // Reset search as well
    defaultFilters.search = "";
    
    // Update filters state
    setFilters(defaultFilters);
    
    // Notify parent component
    onFiltersChange(defaultFilters);
  };

  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Search Form */}
      {showSearch && (
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              value={filters.search || ""}
              onChange={handleSearchChange}
            />
          </div>
        </form>
      )}

      {/* Filter Selects */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(filterOptions).map(([filterName, filterConfig]) => (
          <div key={filterName} className="w-full sm:w-auto">
            <Select
              value={filters[filterName] || filterConfig.defaultValue || ""}
              onValueChange={(value) => handleFilterChange(filterName, value)}
            >
              <SelectTrigger className={filterConfig.width || "w-[160px]"}>
                <SelectValue placeholder={filterConfig.placeholder || `Filter by ${filterName}`} />
              </SelectTrigger>
              <SelectContent>
                {filterConfig.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* Reset Filters Button */}
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleResetFilters}
        >
          <Filter className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};