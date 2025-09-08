import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/customs/form-input";

const loginSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({
  disabled,
  onSubmit,
  defaultValues,
}: {
  disabled?: boolean;
  onSubmit: (values: LoginFormValues) => void;
  defaultValues?: LoginFormValues;
}) => {
  const form = useForm<LoginFormValues>({
    disabled,
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const isDisabled = disabled || form.formState.isSubmitting;

  const buttomLabel = () => {
    if (disabled) return "Disabled";
    if (form.formState.isSubmitting) return "Logging in...";
    return "Login";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={form.control} name="username" label="Username" placeholder="username" />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <Button type="submit" className="w-full" disabled={isDisabled}>
          {buttomLabel()}
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
