"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";

interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  multiple?: boolean;
  accept?: string;
  description?: string;
}

export function FormFileInput<T extends FieldValues>({
  control,
  name,
  label,
  multiple = false,
  accept,
  description,
}: FormFileInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Input
            id={name}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              field.onChange(multiple ? Array.from(files) : files[0]);
            }}
          />

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
