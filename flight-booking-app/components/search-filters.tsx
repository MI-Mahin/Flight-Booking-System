"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SearchFiltersProps {
  filters: {
    departure: string
    arrival: string
    date: string
    priceRange: string
  }
  onFiltersChange: (filters: any) => void
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="departure" className="text-xs">
          From
        </Label>
        <Input
          id="departure"
          placeholder="Departure city"
          value={filters.departure}
          onChange={(e) => handleFilterChange("departure", e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="arrival" className="text-xs">
          To
        </Label>
        <Input
          id="arrival"
          placeholder="Arrival city"
          value={filters.arrival}
          onChange={(e) => handleFilterChange("arrival", e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date" className="text-xs">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceRange" className="text-xs">
          Price Range
        </Label>
        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Any price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any price</SelectItem>
            <SelectItem value="low">Under $200</SelectItem>
            <SelectItem value="medium">$200 - $400</SelectItem>
            <SelectItem value="high">$400+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
