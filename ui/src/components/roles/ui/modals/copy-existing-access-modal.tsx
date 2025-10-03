import type { Option } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/custom-ui/base-modal";
import { Form } from "@/components/ui/form";
import { useCopyExistingAccessModal } from "../../hooks/use-role-modal-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { copyExistingAccess, fetchRoleOptions } from "../../api";
import { FormSearchInput } from "@/components/custom-ui/form-search-input";
import { CopyExistingAccessSchema, type ExistingAccessFormValues } from "../../schema";

import { Route } from "@/routes/(app)/dashboard/roles/$roleId";

const CopyExistingAccessModal = () => {
  const copyExistingAccessModal = useCopyExistingAccessModal();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const roleId = copyExistingAccessModal.uuid;

  const { data: roleOptionsData, ...roleOptionsQuery } = useQuery<Option[]>({
    queryKey: ["roles-options"],
    queryFn: fetchRoleOptions,
    enabled: !!roleId,
  });

  const mutation = useMutation({
    mutationFn: copyExistingAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["access"] });
      toast.success("Data updated successfully");
      form.reset();
      copyExistingAccessModal.onOpenChange(false);
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

  const isFormDisabble = mutation.isPending || roleOptionsQuery.isLoading;

  const form = useForm<ExistingAccessFormValues>({
    resolver: zodResolver(CopyExistingAccessSchema),
    defaultValues: {
      copy_from_uuid: undefined,
      copy_to_uuid: roleId ?? undefined,
    },
    disabled: isFormDisabble,
  });

  const onSubmit = async (values: ExistingAccessFormValues) => {
    await mutation.mutateAsync(values);
  };

  const isDisabled = form.formState.disabled;

  // remvove the current active role
  const roleOptions = (roleOptionsData ?? []).filter((role) => role.value !== roleId);

  return (
    <BaseModal
      open={copyExistingAccessModal.isOpen}
      onOpenChange={copyExistingAccessModal.onOpenChange}
      title="Update Data"
      description="Change the fields below to keep your data up to date."
      size="md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormSearchInput control={form.control} name="copy_from_uuid" label="Role" options={roleOptions} />
          <Button type="submit" className="w-full" disabled={isDisabled}>
            Submit
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
};

export default CopyExistingAccessModal;
