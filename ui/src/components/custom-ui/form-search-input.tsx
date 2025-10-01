"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CompoBox, type CompoBoxOption } from "./combobox";

interface FormSearchInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: CompoBoxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
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
  className,
}: FormSearchInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <CompoBox
              filterKey={name} // so it works with your CompoBox API
              options={options}
              value={field.value}
              onChange={(_, value) => field.onChange(value)} // integrate with RHF
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
