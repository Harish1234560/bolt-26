import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Bookmark, Flame, CheckCircle2, BookOpen, Target } from "lucide-react";
import { useLearning } from "@/context/LearningContext";

export default function ProfilePage() {
  const { courses, topics, completedTopics, bookmarkedTopics, quizScores, streak } = useLearning();

  const completedByCourse = courses.map((course) => {
    const courseTopics = topics.filter((t) => t.courseId === course.id);
    const completed = courseTopics.filter((t) => completedTopics.includes(t.id)).length;
    return { ...course, total: courseTopics.length, completed, pct: courseTopics.length > 0 ? Math.round((completed / courseTopics.length) * 100) : 0 };
  });

  const bookmarked = topics.filter((t) => bookmarkedTopics.includes(t.id));
  const totalQuizzes = Object.keys(quizScores).length;
  const avgScore = totalQuizzes > 0 ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / totalQuizzes * 10) / 10 : 0;

  const stats = [
    { icon: CheckCircle2, label: "Completed", value: completedTopics.length, color: "text-success" },
    { icon: Bookmark, label: "Bookmarked", value: bookmarkedTopics.length, color: "text-warning" },
    { icon: Flame, label: "Day Streak", value: streak, color: "text-destructive" },
    { icon: Target, label: "Quizzes Taken", value: totalQuizzes, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-2xl text-primary-foreground font-bold">
              L
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Learner Profile</h1>
              <p className="text-sm text-muted-foreground">Track your progress and achievements</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="p-4 rounded-xl border border-border bg-card text-center">
                <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Course Progress */}
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Course Progress
          </h2>
          <div className="space-y-3 mb-10">
            {completedByCourse.map((c) => (
              <Link key={c.id} to={`/course/${c.id}`} className="block p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-medium text-foreground">{c.name}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{c.completed}/{c.total}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-bg transition-all duration-500" style={{ width: `${c.pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{c.pct}% complete</p>
              </Link>
            ))}
          </div>

          {/* Quiz Scores */}
          {totalQuizzes > 0 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Quiz Scores
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {Object.entries(quizScores).map(([topicId, score]) => {
                  const topic = topics.find((t) => t.id === topicId);
                  return (
                    <div key={topicId} className="p-3 rounded-xl border border-border bg-card">
                      <p className="text-sm font-medium text-foreground truncate">{topic?.title ?? topicId}</p>
                      <p className="text-lg font-bold text-success">{score} pts</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Bookmarks */}
          {bookmarked.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-warning" /> Bookmarked Topics
              </h2>
              <div className="space-y-2">
                {bookmarked.map((t) => {
                  const course = courses.find((c) => c.id === t.courseId);
                  return (
                    <Link
                      key={t.id}
                      to={`/course/${t.courseId}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-warning/30 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-warning flex-shrink-0" fill="currentColor" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{course?.icon} {course?.name}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
