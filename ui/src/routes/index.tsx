import Navbar from "@/components/custom-ui/navbar";
import NavbarFooter from "@/components/custom-ui/navbar-footer";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col   text-gray-900">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <motion.h1
          className="text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to <span className="text-blue-600">DevDel</span>
        </motion.h1>

        <p className="text-gray-600 text-lg max-w-2xl mb-8">
          The platform for developers to grow, collaborate, and create modern web experiences.
        </p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link to="/login">
            <Button size="lg" className="rounded-2xl shadow-md hover:scale-105 transition-transform">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </main>

      <section className="grid gap-6 md:grid-cols-3 w-full max-w-6xl mx-auto px-6 pb-20">
        {[
          {
            title: "Build Fast",
            desc: "Accelerate your development with modern stacks and reusable templates.",
          },
          {
            title: "Collaborate",
            desc: "Join a network of talented developers and open-source contributors.",
          },
          {
            title: "Deploy Easily",
            desc: "From local to cloud, DevDel supports your workflow with simple tools.",
          },
        ].map((feature, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg min-h-48 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>{feature.desc}</CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <NavbarFooter />
    </div>
  );
}
