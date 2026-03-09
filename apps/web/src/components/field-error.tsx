import { Typography } from "@friends/ui/typography";
import { CheckCircleIcon } from "./icons/check-circle";
import { XCircleIcon } from "./icons/x-circle";

export interface FieldRule {
  label: string;
  valid: boolean;
}

export function FieldError({ rules }: { rules: FieldRule[] }) {
  if (rules.length === 0) return null;
  return (
    <ul className="mt-1.5 space-y-0.5">
      {rules.map(({ label, valid }) => (
        <li key={label} className="flex items-center gap-1.5">
          {valid ? (
            <CheckCircleIcon className="shrink-0 text-green-500" />
          ) : (
            <XCircleIcon className="shrink-0 text-red-500" />
          )}
          <Typography variant="caption" className={valid ? "text-green-500" : "text-red-500"}>
            {label}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
