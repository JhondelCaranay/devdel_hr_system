"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
interface FormDateProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: "date" | "time" | "datetime-local";
  placeholder?: string;
  description?: string;
}

export function FormDate<T extends FieldValues>({
  control,
  name,
  label,
  type = "date",
  placeholder,
  description,
}: FormDateProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-fit">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            value={
              field.value
                ? type === "datetime-local"
                  ? new Date(field.value).toISOString().slice(0, 16)
                  : type === "date"
                    ? new Date(field.value).toISOString().slice(0, 10)
                    : field.value
                : ""
            }
            onChange={(e) => field.onChange(e.target.value)}
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
