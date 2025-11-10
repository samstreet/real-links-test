"use client";

import { Input } from "@heroui/react";
import { useState } from "react";

interface AnagramSearchProps {
  onSearch?: (term: string) => void;
}

export function AnagramSearch({ onSearch }: AnagramSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Input
      label="Enter a word or phrase"
      placeholder="e.g., steak, engineer, iceman"
      value={searchTerm}
      onChange={(e) => handleChange(e.target.value)}
      size="lg"
      aria-label="Search for anagrams"
      description="Enter any word to find all possible anagrams"
      classNames={{
        input: "text-lg",
      }}
      isClearable
      onClear={() => handleChange("")}
    />
  );
}
