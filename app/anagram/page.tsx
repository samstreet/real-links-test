"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnagramPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Anagram Finder
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Welcome, {session.user?.name || session.user?.email}
            </p>
          </div>
          <Button
            color="danger"
            variant="light"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
          >
            Sign Out
          </Button>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Find Anagrams</h2>
          </CardHeader>
          <CardBody>
            <Input
              label="Enter a word or phrase"
              placeholder="e.g., steak, engineer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
              aria-label="Search for anagrams"
              description="Enter any word to find all possible anagrams"
              classNames={{
                input: "text-lg",
              }}
            />
          </CardBody>
        </Card>

        {/* Results Card - Placeholder */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Results</h2>
          </CardHeader>
          <CardBody>
            {!searchTerm ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Enter a word above to find anagrams
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Anagram search functionality will be implemented in Phase 2
                <div className="mt-4 text-sm">
                  Searching for: <strong>{searchTerm}</strong>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Info Section */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-gray-800">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
            What are anagrams?
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Anagrams are words or phrases formed by rearranging the letters of
            another word or phrase. Our tool ignores punctuation and is
            case-insensitive.
          </p>
          <div className="mt-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Examples:</strong>
            </p>
            <ul className="ml-6 list-disc">
              <li>iceman and cinema</li>
              <li>engineer and re-engineer (ignores hyphen)</li>
              <li>Worth and throw (ignores case)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
