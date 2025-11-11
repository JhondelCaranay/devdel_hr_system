"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { FormInput } from "./custom-ui/form/form-input";
import { FormFileInput } from "./custom-ui/form/form-input-file";
import { FormCheckbox } from "./custom-ui/form/form-input-checkbox";
import { FormTextarea } from "./custom-ui/form/form-textarea";
import { FormSearchInput } from "./custom-ui/form/form-search-input";
import { Field, FieldGroup } from "./ui/field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDate } from "./custom-ui/form/form-input-date";
import { FormRichText } from "./custom-ui/form/form-rich-text-editor";
import { isHtmlEmpty } from "@/lib/utils";

// ✅ Validation schema using Zod (optional)
const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  birthDate: z.string(),
  birthTime: z.string(),
  profilePicture: z.any().optional(),
  agreeTerms: z.boolean(),
  remarks: z.string().optional(),
  remarks_richtext: z.string().refine((val) => !isHtmlEmpty(val), {
    message: "Remarks cannot be empty",
  }),
  status: z.string().min(1, "Select a status"),
  richText: z.string(),
});

type FormValues = z.infer<typeof schema>;

export default function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "test",
      email: "test@gmail.com",
      birthDate: "",
      birthTime: "",
      profilePicture: undefined,
      agreeTerms: false,
      remarks: "",
      remarks_richtext: "",
      status: "",
      richText: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);

    // 1️⃣ Combine date and time into a single ISO string
    const localDateTime = new Date(`${values.birthDate}T${values.birthTime}`);

    // 2️⃣ Convert to ISO (UTC format)
    const isoString = localDateTime.toISOString();

    // 3️⃣ Convert back to local time (for verification)
    const localTime = new Date(isoString);

    console.log("Local Date/Time Input:", values.birthDate, values.birthTime);
    console.log("ISO (UTC):", isoString);
    console.log("Back to Local:", localTime.toString());
    console.log("Readable Local Time:", localTime.toLocaleString());
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>Help us improve by reporting bugs you encounter.</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="text-xs">
          <code>{JSON.stringify(form.watch(), null, 2)}</code>
        </pre>
        <form id="example" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormRichText
              control={form.control}
              name="remarks_richtext"
              label="Remarks Rich Text"
              placeholder="Write your bug report..."
            />

            {/* ✅ Text input */}
            <FormInput control={form.control} name="fullName" label="Full Name" placeholder="Enter your name" />

            {/* ✅ Email input */}
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email"
            />
            {/* ✅ Date input */}
            <div className="grid grid-cols-2">
              <FormDate control={form.control} name="birthDate" label="Birth Date" type="date" />
              <FormDate control={form.control} name="birthTime" label="Birth Time" type="time" />
            </div>

            {/* ✅ File upload */}
            <FormFileInput control={form.control} name="profilePicture" label="Profile Picture" accept="image/*" />

            {/* ✅ Checkbox */}
            <FormCheckbox control={form.control} name="agreeTerms" label="I agree to the terms and conditions" />

            {/* ✅ Textarea */}
            <FormTextarea
              control={form.control}
              name="remarks"
              label="Remarks"
              placeholder="Write your notes..."
              rows={3}
            />

            {/* ✅ Select dropdown */}
            <FormSearchInput
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
              ]}
            />

            {/* ✅ Submit button */}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="w-full">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="example">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
