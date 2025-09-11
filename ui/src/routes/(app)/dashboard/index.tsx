import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Button className="">Click me</Button>
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
