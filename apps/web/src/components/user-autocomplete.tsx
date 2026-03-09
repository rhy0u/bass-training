"use client";

import { searchUsers } from "@/app/actions/groups";
import { Avatar } from "@friends/ui/avatar";
import { Input } from "@friends/ui/input";
import { useEffect, useRef, useState, useTransition } from "react";

interface UserResult {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface UserAutocompleteProps {
  excludeGroupId?: string;
  onSelect: (userId: string) => void;
  placeholder?: string;
}

export function UserAutocomplete({ excludeGroupId, onSelect, placeholder }: UserAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      // Use a microtask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setResults([]);
        setOpen(false);
      });
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const users = await searchUsers(query, excludeGroupId);
        setResults(users);
        setOpen(users.length > 0);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, excludeGroupId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (userId: string) => {
    onSelect(userId);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground-secondary border-t-transparent" />
        </div>
      )}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg">
          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSelect(user.id)}
            >
              <Avatar src={user.avatar} fallback={user.name ?? user.email} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name ?? user.email}
                </p>
                <p className="truncate text-xs text-foreground-secondary">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
