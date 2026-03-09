import { Typography } from "@friends/ui/typography";
import Image from "next/image";

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
          <Image
            src={valid ? "/icons/check-circle.svg" : "/icons/x-circle.svg"}
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
          <Typography variant="caption" className={valid ? "text-green-500" : "text-red-500"}>
            {label}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
