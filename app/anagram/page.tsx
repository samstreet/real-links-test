"use client";

import { Button, Card, CardBody, CardHeader, Input, Spinner } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { AnagramResult } from "@/types/anagram.types";

enum SearchStateStatus {
  Idle = 'idle',
  Searching = 'searching',
  Success = 'success',
  Error = 'error',
}

type SearchState =
  | { status: SearchStateStatus.Idle }
  | { status: SearchStateStatus.Searching }
  | { status: SearchStateStatus.Success; result: AnagramResult }
  | { status: SearchStateStatus.Error; message: string };

export default function AnagramPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({ status: SearchStateStatus.Idle });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [authStatus, router]);

  const performSearch = useCallback(async (input: string) => {
    if (!input.trim()) {
      setSearchState({ status: SearchStateStatus.Idle });
      return;
    }

    setSearchState({ status: SearchStateStatus.Searching });

    try {
      const response = await fetch('/api/anagram/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSearchState({
          status: SearchStateStatus.Error,
          message: data.error?.message || 'Failed to search for anagrams',
        });
        return;
      }

      setSearchState({
        status: SearchStateStatus.Success,
        result: data.data,
      });
    } catch {
      setSearchState({
        status: SearchStateStatus.Error,
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Anagram Finder
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {session.user?.email}
              </p>
            </div>
            <Button
              variant="light"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Sign out"
            >
              Sign out
            </Button>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Enter a word or phrase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            aria-label="Search for anagrams"
            isClearable
            onClear={() => setSearchTerm('')}
            classNames={{
              input: "text-lg",
            }}
          />
        </div>

        {/* Results */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Results
              </h2>
              {searchState.status === SearchStateStatus.Success && !searchState.result.isEmpty && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {searchState.result.totalMatches} found in{' '}
                  {searchState.result.searchTimeMs < 1
                    ? '<1ms'
                    : `${searchState.result.searchTimeMs}ms`}
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div
              role="region"
              aria-live="polite"
              aria-atomic="true"
              aria-label="Search results"
            >
              {searchState.status === SearchStateStatus.Idle && (
                <div className="py-16 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Enter a word to find anagrams
                  </p>
                </div>
              )}

              {searchState.status === SearchStateStatus.Searching && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Spinner />
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Searching...
                  </p>
                </div>
              )}

              {searchState.status === SearchStateStatus.Error && (
                <div
                  className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4 text-center"
                  role="alert"
                >
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {searchState.message}
                  </p>
                </div>
              )}

              {searchState.status === SearchStateStatus.Success && (
                <>
                  {searchState.result.isEmpty ? (
                    <div className="py-16 text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        No anagrams found
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try a different word
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {searchState.result.matches.map((match, index) => (
                        <div
                          key={`${match.word}-${index}`}
                          className={`rounded-lg border px-4 py-3 text-center text-sm transition-colors ${
                            match.isOriginalInput
                              ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
                          }`}
                        >
                          {match.word}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Info */}
        <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            About Anagrams
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Anagrams are words formed by rearranging the letters of another word.
            Punctuation is ignored and matching is case-insensitive.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500">
            <div>
              <span className="font-medium">iceman</span> → cinema
            </div>
            <div>
              <span className="font-medium">engineer</span> → re-engine
            </div>
            <div>
              <span className="font-medium">Worth</span> → throw
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
