import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, Bookmark, Menu, X } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import TopicViewer from "@/components/TopicViewer";

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, getTopicsForCourse, completedTopics, bookmarkedTopics, addRecent, contentReady } = useLearning();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courses.find((c) => c.id === courseId);
  const courseTopics = getTopicsForCourse(courseId || "");

  useEffect(() => {
    if (courseTopics[currentIndex]) {
      addRecent(courseTopics[currentIndex].id);
    }
  }, [currentIndex, courseTopics]);

  if (!contentReady) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading course…</p>
      </div>
    );
  }

  if (!course || courseTopics.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found or has no topics.</p>
          <Link to="/" className="text-primary hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const topic = courseTopics[currentIndex];
  const completedCount = courseTopics.filter((t) => completedTopics.includes(t.id)).length;

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full gradient-bg text-primary-foreground shadow-lg flex items-center justify-center"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 border-r border-border bg-card overflow-y-auto z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> All Courses
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{course.icon}</span>
            <h2 className="font-bold text-foreground">{course.name}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {completedCount}/{courseTopics.length} completed
          </p>
          <div className="h-1 rounded-full bg-muted mb-6 overflow-hidden">
            <div
              className="h-full gradient-bg transition-all"
              style={{ width: `${(completedCount / courseTopics.length) * 100}%` }}
            />
          </div>
        </div>

        <nav className="px-2 pb-4 space-y-0.5">
          {courseTopics.map((t, i) => {
            const isActive = i === currentIndex;
            const isCompleted = completedTopics.includes(t.id);
            const isBookmarked = bookmarkedTopics.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentIndex(i);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-colors"
                  style={{
                    borderColor: isCompleted ? "hsl(var(--success))" : isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                    backgroundColor: isCompleted ? "hsl(var(--success) / 0.1)" : "transparent",
                    color: isCompleted ? "hsl(var(--success))" : isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className="flex-1 truncate">{t.title}</span>
                {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-warning flex-shrink-0" fill="currentColor" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content */}
      <TopicViewer
        topic={topic}
        topics={courseTopics}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
      />
    </div>
  );
}
