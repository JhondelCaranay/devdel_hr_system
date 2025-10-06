import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import NavbarFooter from "@/components/custom-ui/navbar-footer";
import Navbar from "@/components/custom-ui/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4 text-gray-900"
        >
          About <span className="text-blue-600">DevDel</span>
        </motion.h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Building tools, knowledge, and communities that empower developers worldwide.
        </p>
      </section>

      {/* Mission, Vision, Values */}
      <section className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-6 pb-20">
        {[
          {
            title: "Our Mission",
            text: "To empower developers globally by providing accessible education, collaboration, and opportunities.",
          },
          {
            title: "Our Vision",
            text: "To create a world where every developer can innovate freely and make meaningful impact.",
          },
          {
            title: "Our Values",
            text: "Innovation, collaboration, integrity, and continuous learning are at the heart of DevDel.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-all border border-gray-100">
              <CardHeader>
                <CardTitle className="text-blue-600">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{item.text}</CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Description Card */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-md border border-gray-100">
            <CardContent className="p-8 text-gray-700 leading-relaxed">
              <p>
                DevDel was founded with the vision to make software development more accessible and impactful. Our goal
                is to connect developers, startups, and enterprises through innovation, mentorship, and cutting-edge
                technology. Whether you’re a beginner looking to learn or a company seeking skilled talent, DevDel
                bridges the gap with passion and precision.
              </p>
              <p className="mt-4">
                From educational resources to job opportunities, we continuously evolve to meet the needs of modern
                developers and teams. Our community-driven approach ensures that everyone — from coders to creators —
                can thrive and contribute.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <NavbarFooter />
    </div>
  );
}
