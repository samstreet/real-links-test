import Link from "next/link";
import { Button } from "@heroui/react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Anagram Finder
        </h1>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
          Discover all possible anagrams for any word using our comprehensive
          English word list.
        </p>

        <div className="mb-12 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <ul className="space-y-2 text-left text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">
                1.
              </span>
              <span>Sign in with your Gmail account</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">
                2.
              </span>
              <span>Enter any word or phrase</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600 dark:text-blue-400">
                3.
              </span>
              <span>Instantly see all matching anagrams</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            as={Link}
            href="/auth/signin"
            size="lg"
            color="primary"
            className="font-semibold"
          >
            Get Started
          </Button>
          <Button
            as={Link}
            href="/anagram"
            size="lg"
            variant="bordered"
            className="font-semibold"
          >
            View Demo
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Built with Next.js 14, TypeScript, and HeroUI
            <br />
            Real Links Code Challenge
          </p>
        </div>
      </div>
    </main>
  );
}
