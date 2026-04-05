import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { courses as initialCourses, topics as initialTopics, Course, Topic } from "@/data/courses";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  loadRemoteContent,
  seedIfEmpty,
  rowToCourse,
  rowToTopic,
  remoteInsertCourse,
  remoteDeleteCourse,
  remoteInsertTopic,
  remoteUpdateTopic,
  remoteDeleteTopic,
  type DbCourseRow,
  type DbTopicRow,
} from "@/lib/learningRemote";

interface LearningState {
  courses: Course[];
  topics: Topic[];
  completedTopics: string[];
  bookmarkedTopics: string[];
  recentTopics: string[];
  quizScores: Record<string, number>;
  streak: number;
  darkMode: boolean;
  /** False until remote load finishes or local hydration runs. */
  contentReady: boolean;
  /** Set when Supabase is configured but initial sync failed (data falls back to bundled defaults). */
  contentSyncError: string | null;
  toggleDarkMode: () => void;
  toggleComplete: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  addRecent: (topicId: string) => void;
  addCourse: (course: Course) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (topic: Topic) => void;
  deleteTopic: (topicId: string) => void;
  deleteCourse: (courseId: string) => void;
  getTopicsForCourse: (courseId: string) => Topic[];
  saveQuizScore: (topicId: string, score: number) => void;
}

const LearningContext = createContext<LearningState | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function calculateStreak(): number {
  try {
    const dates: string[] = JSON.parse(localStorage.getItem("lp-activity-dates") || "[]");
    if (dates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dates.includes(key)) streak++;
      else if (i > 0) break;
    }
    return streak;
  } catch {
    return 0;
  }
}

function recordActivity() {
  try {
    const dates: string[] = JSON.parse(localStorage.getItem("lp-activity-dates") || "[]");
    const today = new Date().toISOString().slice(0, 10);
    if (!dates.includes(today)) {
      const updated = [today, ...dates].slice(0, 365);
      localStorage.setItem("lp-activity-dates", JSON.stringify(updated));
    }
  } catch {
    /* ignore */
  }
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const useRemote = Boolean(supabase);

  const [courses, setCourses] = useState<Course[]>(() =>
    useRemote ? [] : loadFromStorage("lp-courses", initialCourses)
  );
  const [topics, setTopics] = useState<Topic[]>(() =>
    useRemote ? [] : loadFromStorage("lp-topics", initialTopics)
  );
  const [completedTopics, setCompleted] = useState<string[]>(() => loadFromStorage("lp-completed", []));
  const [bookmarkedTopics, setBookmarked] = useState<string[]>(() => loadFromStorage("lp-bookmarks", []));
  const [recentTopics, setRecent] = useState<string[]>(() => loadFromStorage("lp-recent", []));
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => loadFromStorage("lp-quiz-scores", {}));
  const [darkMode, setDarkMode] = useState(() => loadFromStorage("lp-dark", false));
  const [streak, setStreak] = useState(() => calculateStreak());
  const [contentReady, setContentReady] = useState(!isSupabaseConfigured);
  const [contentSyncError, setContentSyncError] = useState<string | null>(null);

  const topicsRef = useRef(topics);
  const coursesRef = useRef(courses);
  useEffect(() => {
    topicsRef.current = topics;
  }, [topics]);
  useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  useEffect(() => {
    if (useRemote) return;
    localStorage.setItem("lp-courses", JSON.stringify(courses));
  }, [courses, useRemote]);
  useEffect(() => {
    if (useRemote) return;
    localStorage.setItem("lp-topics", JSON.stringify(topics));
  }, [topics, useRemote]);
  useEffect(() => {
    localStorage.setItem("lp-completed", JSON.stringify(completedTopics));
  }, [completedTopics]);
  useEffect(() => {
    localStorage.setItem("lp-bookmarks", JSON.stringify(bookmarkedTopics));
  }, [bookmarkedTopics]);
  useEffect(() => {
    localStorage.setItem("lp-recent", JSON.stringify(recentTopics));
  }, [recentTopics]);
  useEffect(() => {
    localStorage.setItem("lp-quiz-scores", JSON.stringify(quizScores));
  }, [quizScores]);
  useEffect(() => {
    localStorage.setItem("lp-dark", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        topicCount: topics.filter((t) => t.courseId === c.id).length,
      }))
    );
  }, [topics]);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      try {
        await seedIfEmpty(supabase);
        const loaded = await loadRemoteContent(supabase);
        if (cancelled) return;
        setCourses(loaded.courses);
        setTopics(loaded.topics);
        setContentSyncError(null);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Could not sync with Supabase";
          setContentSyncError(msg);
          setCourses(initialCourses);
          setTopics(initialTopics);
        }
      } finally {
        if (!cancelled) setContentReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !contentReady) return;

    const channel = supabase
      .channel("learning-content")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "courses" },
        (payload) => {
          const t = topicsRef.current;
          if (payload.eventType === "INSERT" && payload.new) {
            const course = rowToCourse(payload.new as DbCourseRow);
            setCourses((prev) => {
              if (prev.some((c) => c.id === course.id)) return prev;
              const tc = t.filter((x) => x.courseId === course.id).length;
              return [...prev, { ...course, topicCount: tc }];
            });
          } else if (payload.eventType === "UPDATE" && payload.new) {
            const course = rowToCourse(payload.new as DbCourseRow);
            setCourses((prev) =>
              prev.map((c) =>
                c.id === course.id ? { ...course, topicCount: t.filter((x) => x.courseId === course.id).length } : c
              )
            );
          } else if (payload.eventType === "DELETE" && payload.old) {
            const id = (payload.old as { id: string }).id;
            setCourses((prev) => prev.filter((c) => c.id !== id));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "topics" },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            const topic = rowToTopic(payload.new as DbTopicRow);
            setTopics((prev) => {
              if (prev.some((x) => x.id === topic.id)) return prev;
              return [...prev, topic];
            });
          } else if (payload.eventType === "UPDATE" && payload.new) {
            const topic = rowToTopic(payload.new as DbTopicRow);
            setTopics((prev) => prev.map((x) => (x.id === topic.id ? topic : x)));
          } else if (payload.eventType === "DELETE" && payload.old) {
            const id = (payload.old as { id: string }).id;
            setTopics((prev) => prev.filter((x) => x.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, contentReady]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
    recordActivity();
    setStreak(calculateStreak());
  };

  const toggleBookmark = (id: string) =>
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const addRecent = (id: string) => {
    setRecent((prev) => [id, ...prev.filter((t) => t !== id)].slice(0, 10));
    recordActivity();
    setStreak(calculateStreak());
  };

  const addCourse = (course: Course) => {
    setCourses((prev) => [...prev, course]);
    if (supabase) {
      void remoteInsertCourse(supabase, course).catch((err) => {
        console.error(err);
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
      });
    }
  };

  const addTopic = (topic: Topic) => {
    setTopics((prev) => [...prev, topic]);
    if (supabase) {
      void remoteInsertTopic(supabase, topic).catch((err) => {
        console.error(err);
        setTopics((prev) => prev.filter((t) => t.id !== topic.id));
      });
    }
  };

  const updateTopic = (topic: Topic) => {
    setTopics((prev) => prev.map((t) => (t.id === topic.id ? topic : t)));
    if (supabase) {
      void remoteUpdateTopic(supabase, topic).catch((err) => console.error(err));
    }
  };

  const deleteTopic = (id: string) => {
    const backup = topicsRef.current.find((t) => t.id === id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (supabase) {
      void remoteDeleteTopic(supabase, id).catch((err) => {
        console.error(err);
        if (backup) setTopics((prev) => [...prev, backup]);
      });
    }
  };

  const deleteCourse = (id: string) => {
    const backupCourses = [...coursesRef.current];
    const backupTopics = [...topicsRef.current];
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setTopics((prev) => prev.filter((t) => t.courseId !== id));
    if (supabase) {
      void remoteDeleteCourse(supabase, id).catch((err) => {
        console.error(err);
        setCourses(backupCourses);
        setTopics(backupTopics);
      });
    }
  };

  const getTopicsForCourse = (courseId: string) =>
    topics.filter((t) => t.courseId === courseId).sort((a, b) => a.order - b.order);

  const saveQuizScore = (topicId: string, score: number) => {
    setQuizScores((prev) => {
      const best = prev[topicId] ?? 0;
      return score > best ? { ...prev, [topicId]: score } : prev;
    });
    recordActivity();
    setStreak(calculateStreak());
  };

  return (
    <LearningContext.Provider
      value={{
        courses,
        topics,
        completedTopics,
        bookmarkedTopics,
        recentTopics,
        quizScores,
        streak,
        darkMode,
        contentReady,
        contentSyncError,
        toggleDarkMode,
        toggleComplete,
        toggleBookmark,
        addRecent,
        addCourse,
        addTopic,
        updateTopic,
        deleteTopic,
        deleteCourse,
        getTopicsForCourse,
        saveQuizScore,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error("useLearning must be used within LearningProvider");
  return ctx;
}
