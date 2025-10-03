import type { Role } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/custom-ui/base-modal";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/custom-ui/form-input";
import { useEditRoleModal } from "../../hooks/use-role-modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editRoleSchema, type EditRoleFormValues } from "../../schema";
import { editRole, fetchRoleById } from "../../api";

type RoleDetails = {
  data: Role & { total_users: string };
};

const EditRoleModal = () => {
  const editRoleModal = useEditRoleModal();
  const queryClient = useQueryClient();

  const roleId = editRoleModal.uuid;

  const { data: roleData, ...roleQuery } = useQuery<RoleDetails>({
    queryKey: ["roles", roleId],
    queryFn: () => fetchRoleById(roleId!),
    enabled: !!roleId,
  });

  const mutation = useMutation({
    mutationFn: editRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Data updated successfully");
      form.reset();
      editRoleModal.onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update data. Please try again later.");
    },
  });

  const isFormDisabble = mutation.isPending || roleQuery.isLoading;

  const form = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      uuid: roleData?.data.uuid ?? undefined,
      name: roleData?.data.name ?? undefined,
      description: roleData?.data.description ?? undefined,
    },
    disabled: isFormDisabble,
  });

  const onSubmit = async (values: EditRoleFormValues) => {
    await mutation.mutateAsync(values);
  };

  const isDisabled = form.formState.disabled;

  return (
    <BaseModal
      open={editRoleModal.isOpen}
      onOpenChange={editRoleModal.onOpenChange}
      title="Update Data"
      description="Change the fields below to keep your data up to date."
      size="md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput control={form.control} name="name" label="Name" placeholder="Enter name" />
          <FormInput control={form.control} name="description" label="Description" placeholder="Enter description" />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            Submit
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
};

export default EditRoleModal;
