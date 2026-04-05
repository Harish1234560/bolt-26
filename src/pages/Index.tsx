import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Code2, Trophy } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import CourseCard from "@/components/CourseCard";

export default function Index() {
  const { courses, recentTopics, topics, completedTopics, contentReady, contentSyncError } = useLearning();
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { icon: BookOpen, label: "Courses", value: courses.length },
    { icon: Code2, label: "Topics", value: topics.length },
    { icon: Trophy, label: "Completed", value: completedTopics.length },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Learn to code, step by step
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Master Programming
              <br />
              <span className="gradient-text">The Right Way</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Structured courses with hands-on examples. Learn Python, Java, JavaScript, C++ and more with our interactive tutorials.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-8 mt-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">All Courses</h2>
        {contentSyncError && (
          <p className="mb-6 text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
            Could not reach Supabase ({contentSyncError}). Showing built-in course data; progress is still saved locally.
          </p>
        )}
        {!contentReady ? (
          <p className="text-center text-muted-foreground py-12">Loading courses…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No courses found matching "{search}"</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
