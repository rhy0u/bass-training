import { Typography } from "@friends/ui/typography";

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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`shrink-0 ${valid ? "text-green-500" : "text-red-500"}`}
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            {valid ? (
              <path
                d="M4.5 7L6.5 9L9.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M5 5L9 9M9 5L5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
          <Typography variant="caption" className={valid ? "text-green-500" : "text-red-500"}>
            {label}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
