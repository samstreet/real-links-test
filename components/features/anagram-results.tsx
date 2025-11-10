"use client";

import { Card, CardBody, Chip } from "@heroui/react";

interface AnagramResultsProps {
  results: string[];
  isLoading?: boolean;
  searchTerm?: string;
}

export function AnagramResults({
  results,
  isLoading = false,
  searchTerm = "",
}: AnagramResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div
            className="py-12 text-center text-gray-500 dark:text-gray-400"
            role="status"
            aria-live="polite"
          >
            Searching for anagrams...
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!searchTerm) {
    return (
      <Card>
        <CardBody>
          <div
            className="py-12 text-center text-gray-500 dark:text-gray-400"
            role="status"
            aria-live="polite"
          >
            Enter a word above to find anagrams
          </div>
        </CardBody>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardBody>
          <div
            className="py-12 text-center"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No anagrams found
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try a different word or phrase
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <div role="region" aria-label="Anagram results">
          <p
            className="mb-4 text-sm text-gray-600 dark:text-gray-400"
            aria-live="polite"
          >
            Found {results.length} anagram{results.length !== 1 ? "s" : ""}
          </p>
          <ul
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="List of anagrams"
          >
            {results.map((word, index) => (
              <li key={`${word}-${index}`}>
                <Chip
                  color="primary"
                  variant="flat"
                  size="lg"
                  className="cursor-default"
                >
                  {word}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
