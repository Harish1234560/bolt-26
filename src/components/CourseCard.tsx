import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Course } from "@/data/courses";
import { useLearning } from "@/context/LearningContext";

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const { getTopicsForCourse, completedTopics } = useLearning();
  const courseTopics = getTopicsForCourse(course.id);
  const completed = courseTopics.filter((t) => completedTopics.includes(t.id)).length;
  const progress = courseTopics.length > 0 ? (completed / courseTopics.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/course/${course.id}`}
        className="group block rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{course.icon}</span>
          {progress > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {Math.round(progress)}%
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {course.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
        <div className="mb-4 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-bg transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{courseTopics.length} topics</span>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Start <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
