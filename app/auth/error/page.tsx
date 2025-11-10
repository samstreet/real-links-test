"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You may not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication.";
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 pb-6">
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
        </CardHeader>
        <CardBody className="gap-4">
          <p className="text-gray-700 dark:text-gray-300">
            {getErrorMessage()}
          </p>

          {error === "AccessDenied" && (
            <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <p className="font-semibold">Note:</p>
              <p>This application only allows sign-in with Gmail accounts.</p>
            </div>
          )}

          <div className="mt-4 flex gap-4">
            <Button
              as={Link}
              href="/auth/signin"
              color="primary"
              className="flex-1"
            >
              Try Again
            </Button>
            <Button as={Link} href="/" variant="bordered" className="flex-1">
              Go Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
