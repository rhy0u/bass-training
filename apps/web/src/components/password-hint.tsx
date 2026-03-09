"use client";

import { useState } from "react";
import { FieldError, type FieldRule } from "./field-error";

interface PasswordHintProps {
  password: string;
  confirmPassword?: string;
  submitted: boolean;
  translations: {
    hintMinLength: string;
    hintUppercase: string;
    hintLowercase: string;
    hintNumber: string;
    hintSpecial: string;
    confirmPasswordRequired?: string;
    passwordsMismatch?: string;
  };
}

export function usePasswordRules(translations: PasswordHintProps["translations"]) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function passwordRules(): FieldRule[] {
    if (!submitted && !password) return [];
    return [
      { label: translations.hintMinLength, valid: password.length >= 8 },
      { label: translations.hintUppercase, valid: /[A-Z]/.test(password) },
      { label: translations.hintLowercase, valid: /[a-z]/.test(password) },
      { label: translations.hintNumber, valid: /\d/.test(password) },
      { label: translations.hintSpecial, valid: /[^a-zA-Z0-9]/.test(password) },
    ];
  }

  function confirmPasswordRules(): FieldRule[] {
    if (!submitted && !confirmPassword) return [];
    const rules: FieldRule[] = [];
    if (translations.confirmPasswordRequired) {
      rules.push({
        label: translations.confirmPasswordRequired,
        valid: confirmPassword.length > 0,
      });
    }
    if (confirmPassword.length > 0 && translations.passwordsMismatch) {
      rules.push({
        label: translations.passwordsMismatch,
        valid: password === confirmPassword,
      });
    }
    return rules;
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    submitted,
    setSubmitted,
    passwordRules,
    confirmPasswordRules,
  };
}

export function PasswordRulesDisplay({
  password,
  submitted,
  translations,
}: Omit<PasswordHintProps, "confirmPassword">) {
  function rules(): FieldRule[] {
    if (!submitted && !password) return [];
    return [
      { label: translations.hintMinLength, valid: password.length >= 8 },
      { label: translations.hintUppercase, valid: /[A-Z]/.test(password) },
      { label: translations.hintLowercase, valid: /[a-z]/.test(password) },
      { label: translations.hintNumber, valid: /\d/.test(password) },
      { label: translations.hintSpecial, valid: /[^a-zA-Z0-9]/.test(password) },
    ];
  }

  return <FieldError rules={rules()} />;
}
