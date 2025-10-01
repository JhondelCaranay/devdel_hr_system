import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import z from "zod";
import { BaseModal } from "@/components/custom-ui/base-modal";
import { UseCopyExistingAccessModal } from "../hooks/use-copy-existing-access";
import { FormSearchInput } from "@/components/custom-ui/form-search-input";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/custom-ui/form-input";
import { FormFileInput } from "@/components/custom-ui/form-file-input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Required"),
  number: z.number("Required").min(2, "Number must be at least 2"),
  file: z.instanceof(File).optional(),
  role: z.string().min(1, "Role is required").optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const CopyExistingAccessModal = () => {
  const copyExistingAccessModal = UseCopyExistingAccessModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      number: undefined,
      file: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);

    form.reset();
    copyExistingAccessModal.onOpenChange(false);
  };

  const dataOptions = [
    { label: "1", value: "option1" },
    { label: "2", value: "option2" },
    { label: "3", value: "option3" },
  ];

  const isDisabled = form.formState.isSubmitting;

  return (
    <BaseModal
      open={copyExistingAccessModal.isOpen}
      onOpenChange={copyExistingAccessModal.onOpenChange}
      title="Add User"
      description="Fill in the details below to add a new access."
      size="md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput control={form.control} name="name" label="Name" placeholder="Enter name" />
          <FormInput control={form.control} name="number" label="Number" placeholder="Enter number" type="number" />
          <FormInput control={form.control} name="email" label="Email" placeholder="Enter email" type="email" />
          <FormFileInput control={form.control} name="file" label="File Upload" />
          <FormSearchInput control={form.control} name="role" label="Role" options={dataOptions} />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            Submit
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
};

export default CopyExistingAccessModal;

export const CopyExistingAccessForm = () => {};
