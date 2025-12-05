import type { Option } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/custom-ui/base-modal";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddRoleAccessSchema, type AddRoleAccessFormValues } from "../../schema";

import { Route } from "@/routes/(app)/dashboard/roles/$roleId";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormSearchInput } from "@/components/custom-ui/form/form-search-input";
import { useAddRoleAccessModal } from "../../hooks/use-role-modal-store";
import { fetchAccessOptions } from "@/components/access/api";
import { addRoleAccess } from "../../api";

const AddRoleAccessModal = () => {
  const addRoleAccessModal = useAddRoleAccessModal();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const roleId = addRoleAccessModal.uuid;

  const { data: accessOptionsData, ...accessOptionsQuery } = useQuery<Option[]>({
    queryKey: ["access-options"],
    queryFn: () => fetchAccessOptions(roleId),
    enabled: !!roleId,
  });

  const mutation = useMutation({
    mutationFn: addRoleAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["access"] });
      toast.success("Data updated successfully");
      form.reset();
      addRoleAccessModal.onOpenChange(false);
      navigate({
        search: (old) => ({
          ...old,
          ...{ ra_page: 1 },
        }),
        replace: true,
      });
    },
    onError: () => {
      toast.error("Failed to update data. Please try again later.");
    },
  });

  const isFormDisabble = mutation.isPending || accessOptionsQuery.isLoading;

  const form = useForm<AddRoleAccessFormValues>({
    resolver: zodResolver(AddRoleAccessSchema),
    defaultValues: {
      access_uuid: undefined,
      role_uuid: roleId ?? undefined,
    },
    disabled: isFormDisabble,
  });

  const onSubmit = async (values: AddRoleAccessFormValues) => {
    await mutation.mutateAsync(values);
  };

  // const isDisabled = form.formState.disabled;

  // const roleOptions = (roleOptionsData ?? []).filter((role) => role.value !== roleId);
  const accessOptions = accessOptionsData ?? [];

  return (
    <BaseModal
      open={addRoleAccessModal.isOpen}
      onOpenChange={addRoleAccessModal.onOpenChange}
      title="Add New Access"
      description="Change the fields below to keep your data up to date."
      size="md"
    >
      <pre className="text-xs">
        <code>{JSON.stringify(accessOptions.length, null, 2)}</code>
      </pre>
      <form id="form-role-copy-access" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormSearchInput
            control={form.control}
            name="access_uuid"
            label="Access"
            options={accessOptions}
            placeholder="Select role"
            searchPlaceholder="Search categories..."
            emptyMessage="No category found."
            description="Choose an access filter results."
          />
          <Field orientation="horizontal" className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-role-copy-access">
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </BaseModal>
  );
};

export default AddRoleAccessModal;
