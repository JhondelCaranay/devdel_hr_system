import { fetchAccessById } from "@/components/access/api";
import FetchErrorMessage from "@/components/custom-ui/fetch-error-message";
import { requirePermission } from "@/lib/auth-guards";
import { Permission } from "@/lib/constants/permissions";
import { PageTitle } from "@/lib/utils";
import type { Access } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

type AccessDetails = {
  data: Access;
};

export const Route = createFileRoute("/(app)/dashboard/access/$accessId")({
  beforeLoad: ({ context, location }) => {
    requirePermission(context.auth, Permission.ACCESS_VIEW_DETAIL_PAGE, location.href);
  },
  component: RouteComponent,
  head: () => PageTitle("HR System / Access / Details"),
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const { accessId } = Route.useParams();

  const { data: accessData, ...accessQuery } = useQuery<AccessDetails>({
    queryKey: ["accesss", accessId],
    queryFn: () => fetchAccessById(accessId),
  });

  const isError = accessQuery.isError;

  if (isError) {
    return <FetchErrorMessage />;
  }

  return (
    <div className="w-full py-10">
      <pre>
        <code>{JSON.stringify(accessData?.data, null, 2)}</code>
      </pre>
    </div>
  );
}
