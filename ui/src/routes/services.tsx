import Navbar from "@/components/custom-ui/navbar";
import NavbarFooter from "@/components/custom-ui/navbar-footer";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/services")({
  component: RouteComponent,
});

function RouteComponent() {
  const services = [
    {
      title: "Custom Web Development",
      desc: "We create scalable, performant, and elegant web applications using React, Nest.js, and more.",
    },
    {
      title: "DevOps & Cloud Setup",
      desc: "Automate deployments, set up CI/CD, and host on AWS or Vercel with ease.",
    },
    {
      title: "UI/UX Design",
      desc: "Intuitive, user-centered designs crafted for speed, simplicity, and conversion.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-gray-900 dark:text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto flex-grow px-6 py-20">
        <h1 className="text-5xl font-bold text-center mb-10 text-gray-900 dark:text-foreground">
          Our <span className="text-blue-600 dark:text-primary">Services</span>
        </h1>
        <p className="text-center text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto mb-12">
          DevDel helps teams accelerate their digital transformation through modern web technologies.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="shadow-md hover:shadow-xl transition-shadow dark:bg-card dark:text-card-foreground">
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>{s.desc}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <NavbarFooter />
    </div>
  );
}
