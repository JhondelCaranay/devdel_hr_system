import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/custom-ui/base-modal";
import { useCreateRoleModal } from "../../hooks/use-role-modal-store";
import { createRoleSchema, type CreateRoleFormValues } from "../../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../../api";
import { toast } from "sonner";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/custom-ui/form/form-input";

const CreateRoleModal = () => {
  const createRoleModal = useCreateRoleModal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Data created successfully");
      form.reset();
      createRoleModal.onOpenChange(false);
    },
    onError: () => {
      toast.error("Data creation failed. Please try again later.");
    },
  });

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    disabled: mutation.isPending,
  });

  const onSubmit = async (values: CreateRoleFormValues) => {
    await mutation.mutateAsync(values);
  };

  return (
    <BaseModal
      open={createRoleModal.isOpen}
      onOpenChange={createRoleModal.onOpenChange}
      title="Add Data"
      description="Fill in the details below to add new data."
      size="md"
    >
      <form id="form-role-access-copy" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput control={form.control} name="name" label="Name" placeholder="Enter name" />
          <FormInput control={form.control} name="description" label="Description" placeholder="Enter description" />
          <Field orientation="horizontal" className="flex justify-end">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-role-access-copy">
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </BaseModal>
  );
};

export default CreateRoleModal;
