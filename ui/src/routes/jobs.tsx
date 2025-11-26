import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import NavbarFooter from "@/components/custom-ui/navbar-footer";
import Navbar from "@/components/custom-ui/navbar";

export const Route = createFileRoute("/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  const jobs = [
    {
      title: "Frontend Engineer",
      desc: "Work with React, TypeScript, and shadcn/ui to create fast, beautiful UIs.",
    },
    {
      title: "Backend Developer",
      desc: "Develop scalable APIs with Nest.js, Prisma, and MySQL. Knowledge of Docker is a plus.",
    },
    {
      title: "Fullstack Intern",
      desc: "Learn by building! Great opportunity for aspiring web developers.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-900 dark:text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-5xl mx-auto flex-grow px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-900 dark:text-foreground">
          Join the <span className="text-blue-600 dark:text-primary">DevDel</span> Team
        </h1>
        <p className="text-gray-600 dark:text-muted-foreground mb-12 max-w-2xl mx-auto">
          We're looking for passionate developers who love building modern apps and learning new tech.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {jobs.map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <Card className="shadow-lg hover:shadow-xl transition-all dark:bg-card dark:text-card-foreground">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{job.desc}</p>
                  <Button className="w-full mt-4 dark:bg-primary dark:text-primary-foreground hover:dark:bg-primary/90 transition-colors">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <NavbarFooter />
    </div>
  );
}
