import { Typography } from "@friends/ui/typography";

interface PasswordHintProps {
  password: string;
  translations: {
    minLength: string;
    uppercase: string;
    lowercase: string;
    number: string;
    special: string;
  };
}

const rules = [
  { key: "minLength" as const, test: (p: string) => p.length >= 8 },
  { key: "uppercase" as const, test: (p: string) => /[A-Z]/.test(p) },
  { key: "lowercase" as const, test: (p: string) => /[a-z]/.test(p) },
  { key: "number" as const, test: (p: string) => /\d/.test(p) },
  { key: "special" as const, test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export function PasswordHint({ password, translations }: PasswordHintProps) {
  return (
    <ul className="mt-2 space-y-0.5">
      {rules.map(({ key, test }) => {
        const passed = password.length > 0 && test(password);
        return (
          <li key={key} className="flex items-center gap-1.5">
            <span className={passed ? "text-green-500" : "text-foreground-muted"}>
              {passed ? "✓" : "○"}
            </span>
            <Typography
              variant="caption"
              className={passed ? "text-green-500" : "text-foreground-muted"}
            >
              {translations[key]}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
}
