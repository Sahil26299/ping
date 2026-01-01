import React from "react";
import { Input } from "@/components/ui/input";
import { FieldConfig } from "@/src/utilities";
import { Eye, EyeClosed } from "lucide-react";

interface FormFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error,
  showPassword,
  onTogglePassword,
}) => {
  const inputType =
    field.type === "password" && showPassword ? "text" : field.type;

  return (
    <div className="space-y-2">
      <label htmlFor={field.id} className="text-sm font-medium text-foreground">
        {field.label}
        <span className="text-primary">{field.required ? "*" : ""}</span>
      </label>

      <div className="relative">
        <Input
          id={field.id}
          type={inputType}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${error ? "border-destructive" : ""} ${
            field.showToggle ? "pr-10" : ""
          }`}
          aria-invalid={!!error}
        />

        {field.showToggle && field.type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>

      {field.description && !error && (
        <p className="text-xs text-muted-foreground italic">
          {field.description}
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
