"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  description?: string;
  autoComplete?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  description,
  autoComplete,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Input
            id={name}
            {...field}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete ?? "off"}
            aria-invalid={fieldState.invalid}
            value={field.value ?? ""}
            onChange={(e) =>
              type === "number" ? field.onChange(e.target.valueAsNumber) : field.onChange(e.target.value)
            }
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
