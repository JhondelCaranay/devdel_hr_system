import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/demos");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData("Failed to load dashboard data.");
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="">
      <pre>
        <code>{JSON.stringify({ message: data }, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify({ message: auth }, null, 2)}</code>
      </pre>
      <Button className="" onClick={handleLogout}>
        log out
      </Button>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam adipisci rem quae repellendus, soluta minima
        aspernatur molestiae ratione voluptates recusandae et aperiam provident? Quod vero eligendi autem ex repellat
        rem dicta sed harum deleniti incidunt distinctio, nihil rerum, veritatis assumenda praesentium placeat ducimus
        natus? Earum sed tempore, adipisci voluptatibus eum facilis sint repudiandae aperiam doloremque magni doloribus
        corporis cupiditate eius quia officiis! Voluptatem magnam sit iusto nam dignissimos voluptas exercitationem
        quibusdam! Eos hic molestias nulla illo dolorum temporibus similique, consectetur nesciunt! Tempora, eaque quia.
        Exercitationem temporibus corrupti illo! Soluta incidunt animi officiis modi? Repudiandae velit fuga tenetur ex
        consectetur ipsa.
      </p>
    </div>
  );
}
