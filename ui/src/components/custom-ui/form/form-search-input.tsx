"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { ComboBox, type CompoBoxOption } from "./form-combo-box";

interface FormSearchInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: CompoBoxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  description?: string;
  className?: string;
}

export function FormSearchInput<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  description,
  className,
}: FormSearchInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <ComboBox
            filterKey={name}
            options={options}
            value={field.value}
            onChange={(_, value) => field.onChange(value)}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            className={className}
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
