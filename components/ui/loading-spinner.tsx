import { Spinner } from "@heroui/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function LoadingSpinner({ size = "md", label }: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} />
      {label && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      )}
    </div>
  );
}
