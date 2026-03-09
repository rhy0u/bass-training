import { Typography } from "@friends/ui/typography";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Typography variant="caption" className="mt-1 text-red-500">
      {message}
    </Typography>
  );
}
