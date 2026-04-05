import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Save, X, BookOpen, FileText, LogIn, LogOut, Lock } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import { Course, Topic } from "@/data/courses";

const DEMO_CREDENTIALS = { username: "admin", password: "admin123" };

type ExtraCodeFormRow = { label: string; code: string; output: string };

const emptyTopicForm = {
  courseId: "",
  title: "",
  section: "Basics",
  order: 1,
  content: "",
  code: "",
  output: "",
  intro: "",
  syntax: "",
  steps: "",
  optimizedCode: "",
  advancedCode: "",
  extraCodes: [] as ExtraCodeFormRow[],
  realWorld: "",
  funFact: "",
  tip: "",
  mistakes: "",
  practice: "",
  challenge: "",
  joke: "",
  summary: "",
};

function formToTopic(form: typeof emptyTopicForm, id: string): Topic {
  return {
    id,
    courseId: form.courseId,
    title: form.title,
    section: form.section,
    order: form.order,
    content: form.content,

    // Optional fields — only include if non-empty
    ...(form.code.trim() && { code: form.code }),
    ...(form.output.trim() && { output: form.output }),
    ...(form.intro.trim() && { intro: form.intro }),
    ...(form.syntax.trim() && { syntax: form.syntax }),
    ...(form.optimizedCode.trim() && { optimizedCode: form.optimizedCode }),
    ...(form.advancedCode.trim() && { advancedCode: form.advancedCode }),
    ...(form.realWorld.trim() && { realWorld: form.realWorld }),
    ...(form.funFact.trim() && { funFact: form.funFact }),
    ...(form.tip.trim() && { tip: form.tip }),
    ...(form.practice.trim() && { practice: form.practice }),
    ...(form.challenge.trim() && { challenge: form.challenge }),
    ...(form.joke.trim() && { joke: form.joke }),
    ...(form.summary.trim() && { summary: form.summary }),

    // Array fields — only include if non-empty
    ...(form.steps.trim() && {
      steps: form.steps.split("\n").map((s) => s.trim()).filter(Boolean),
    }),
    ...(form.mistakes.trim() && {
      mistakes: form.mistakes.split("\n").map((s) => s.trim()).filter(Boolean),
    }),

    // Extra code blocks
    ...(() => {
      const extra = form.extraCodes
        .filter((b) => b.code.trim())
        .map((b) => ({
          label: b.label.trim() || "Code example",
          code: b.code,
          ...(b.output.trim() ? { output: b.output } : {}),
        }));
      return extra.length ? { extraCodes: extra } : {};
    })(),
  };
}

function topicToForm(t: Topic): typeof emptyTopicForm {
  return {
    courseId: t.courseId,
    title: t.title,
    section: t.section,
    order: t.order,
    content: t.content,
    code: t.code ?? "",
    output: t.output ?? "",
    intro: t.intro ?? "",
    syntax: t.syntax ?? "",
    steps: (t.steps ?? []).join("\n"),
    optimizedCode: t.optimizedCode ?? "",
    advancedCode: t.advancedCode ?? "",
    extraCodes:
      t.extraCodes?.map((b) => ({ label: b.label, code: b.code, output: b.output ?? "" })) ?? [],
    realWorld: t.realWorld ?? "",
    funFact: t.funFact ?? "",
    tip: t.tip ?? "",
    mistakes: (t.mistakes ?? []).join("\n"),
    practice: t.practice ?? "",
    challenge: t.challenge ?? "",
    joke: t.joke ?? "",
    summary: t.summary ?? "",
  };
}

export default function AdminPage() {
  const {
    courses,
    topics,
    addCourse,
    addTopic,
    updateTopic,
    deleteTopic,
    deleteCourse,
    getTopicsForCourse,
    contentReady,
    contentSyncError,
  } = useLearning();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("admin-logged-in") === "true"
  );
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"courses" | "topics">("courses");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<
    (typeof emptyTopicForm & { id: string }) | null
  >(null);

  const [courseForm, setCourseForm] = useState({ name: "", description: "", icon: "📘" });
  const [topicForm, setTopicForm] = useState({ ...emptyTopicForm });

  const handleLogin = () => {
    if (
      loginForm.username === DEMO_CREDENTIALS.username &&
      loginForm.password === DEMO_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin-logged-in", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin-logged-in");
  };

  const handleAddCourse = () => {
    if (!courseForm.name) return;
    const id = courseForm.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    addCourse({ id, ...courseForm, color: "217 91% 60%", topicCount: 0 });
    setCourseForm({ name: "", description: "", icon: "📘" });
    setShowCourseForm(false);
  };

  const handleAddTopic = () => {
    if (!topicForm.courseId || !topicForm.title) return;
    const id = "t-" + Date.now();
    addTopic(formToTopic(topicForm, id));
    setTopicForm({ ...emptyTopicForm });
    setShowTopicForm(false);
  };

  const handleUpdateTopic = () => {
    if (!editingTopic) return;
    updateTopic(formToTopic(editingTopic, editingTopic.id));
    setEditingTopic(null);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const labelClass =
    "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

  // ── Login Gate ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm mx-4"
        >
          <div className="p-6 rounded-2xl border border-border bg-card shadow-lg space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Username</label>
                <input
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className={inputClass}
                  placeholder="admin"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <button
                onClick={handleLogin}
                className="w-full py-2.5 rounded-xl gradient-bg text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!contentReady) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading course data…</p>
      </div>
    );
  }

  // ── Topic form fields (reused for add & edit) ──
  const renderTopicFields = (
    form: typeof emptyTopicForm,
    setForm: (f: typeof emptyTopicForm) => void
  ) => (
    <div className="space-y-3">
      {/* Required fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            Course <span className="text-destructive">*</span>
          </label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className={inputClass}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Section</label>
          <input
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            className={inputClass}
            placeholder="e.g. Basics, OOP, Advanced"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            Title <span className="text-destructive">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>
          Main Content <span className="text-destructive">*</span>
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className={inputClass}
          rows={3}
          placeholder="Detailed explanation (separate paragraphs with blank lines)"
        />
      </div>

      {/* Optional fields divider */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Optional fields
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div>
        <label className={labelClass}>Introduction</label>
        <textarea
          value={form.intro}
          onChange={(e) => setForm({ ...form, intro: e.target.value })}
          className={inputClass}
          rows={2}
          placeholder="Short 2-3 line intro..."
        />
      </div>
      <div>
        <label className={labelClass}>Syntax</label>
        <textarea
          value={form.syntax}
          onChange={(e) => setForm({ ...form, syntax: e.target.value })}
          className={inputClass + " font-mono"}
          rows={2}
          placeholder="Syntax template"
        />
      </div>
      <div>
        <label className={labelClass}>Step-by-Step Execution (one per line)</label>
        <textarea
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
          className={inputClass}
          rows={3}
          placeholder="Step 1: ...\nStep 2: ..."
        />
      </div>
      <div>
        <label className={labelClass}>💻 Basic Code</label>
        <textarea
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className={inputClass + " font-mono"}
          rows={3}
        />
      </div>
      <div>
        <label className={labelClass}>⚡ Optimized Code</label>
        <textarea
          value={form.optimizedCode}
          onChange={(e) => setForm({ ...form, optimizedCode: e.target.value })}
          className={inputClass + " font-mono"}
          rows={2}
        />
      </div>
      <div>
        <label className={labelClass}>🚀 Advanced Code</label>
        <textarea
          value={form.advancedCode}
          onChange={(e) => setForm({ ...form, advancedCode: e.target.value })}
          className={inputClass + " font-mono"}
          rows={2}
        />
      </div>
      <div>
        <label className={labelClass}>Output (for basic code above)</label>
        <textarea
          value={form.output}
          onChange={(e) => setForm({ ...form, output: e.target.value })}
          className={inputClass + " font-mono"}
          rows={2}
        />
      </div>

      {/* Extra code blocks */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <label className={labelClass + " mb-0"}>➕ More code blocks</label>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                extraCodes: [...form.extraCodes, { label: "", code: "", output: "" }],
              })
            }
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add block
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Add any number of extra snippets, each with its own label and optional output.
        </p>
        {form.extraCodes.map((row, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-border bg-card space-y-2">
            <div className="flex items-center justify-between gap-2">
              <input
                value={row.label}
                onChange={(e) => {
                  const next = [...form.extraCodes];
                  next[idx] = { ...next[idx], label: e.target.value };
                  setForm({ ...form, extraCodes: next });
                }}
                className={inputClass}
                placeholder="Label (e.g. Alternative approach)"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, extraCodes: form.extraCodes.filter((_, i) => i !== idx) })
                }
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                title="Remove block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={row.code}
              onChange={(e) => {
                const next = [...form.extraCodes];
                next[idx] = { ...next[idx], code: e.target.value };
                setForm({ ...form, extraCodes: next });
              }}
              className={inputClass + " font-mono"}
              rows={3}
              placeholder="Code"
            />
            <textarea
              value={row.output}
              onChange={(e) => {
                const next = [...form.extraCodes];
                next[idx] = { ...next[idx], output: e.target.value };
                setForm({ ...form, extraCodes: next });
              }}
              className={inputClass + " font-mono"}
              rows={2}
              placeholder="Optional output (terminal)"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>🌍 Real-World Use</label>
          <textarea
            value={form.realWorld}
            onChange={(e) => setForm({ ...form, realWorld: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>💡 Fun Fact</label>
          <textarea
            value={form.funFact}
            onChange={(e) => setForm({ ...form, funFact: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>🎯 Coding Tip</label>
          <textarea
            value={form.tip}
            onChange={(e) => setForm({ ...form, tip: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>❌ Common Mistakes (one per line)</label>
          <textarea
            value={form.mistakes}
            onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>✏️ Practice Question</label>
          <textarea
            value={form.practice}
            onChange={(e) => setForm({ ...form, practice: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>🔥 Challenge Problem</label>
          <textarea
            value={form.challenge}
            onChange={(e) => setForm({ ...form, challenge: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>😂 Joke</label>
          <textarea
            value={form.joke}
            onChange={(e) => setForm({ ...form, joke: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
        <div>
          <label className={labelClass}>📌 Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className={inputClass}
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
          <p className="text-muted-foreground mb-8">Manage courses and topics</p>

          {contentSyncError && (
            <p className="mb-6 text-sm text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
              Supabase sync failed ({contentSyncError}). You are editing the offline copy; changes
              may not save to the cloud until the connection works.
            </p>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(["courses", "topics"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t
                    ? "gradient-bg text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "courses" ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Courses Tab ── */}
          {tab === "courses" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Courses ({courses.length})
                </h2>
                <button
                  onClick={() => setShowCourseForm(!showCourseForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>

              {showCourseForm && (
                <div className="mb-6 p-4 rounded-xl border border-border bg-card space-y-3">
                  <div>
                    <label className={labelClass}>Icon (emoji)</label>
                    <input
                      value={courseForm.icon}
                      onChange={(e) => setCourseForm({ ...courseForm, icon: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Rust"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, description: e.target.value })
                      }
                      className={inputClass}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCourse}
                      className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium"
                    >
                      <Save className="w-4 h-4 inline mr-1" /> Save
                    </button>
                    <button
                      onClick={() => setShowCourseForm(false)}
                      className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getTopicsForCourse(c.id).length} topics
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Topics Tab ── */}
          {tab === "topics" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Topics ({topics.length})
                </h2>
                <button
                  onClick={() => setShowTopicForm(!showTopicForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Add Topic
                </button>
              </div>

              {showTopicForm && (
                <div className="mb-6 p-4 rounded-xl border border-border bg-card">
                  {renderTopicFields(topicForm, setTopicForm)}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddTopic}
                      className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium"
                    >
                      <Save className="w-4 h-4 inline mr-1" /> Save
                    </button>
                    <button
                      onClick={() => setShowTopicForm(false)}
                      className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit modal */}
              {editingTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
                  <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Edit Topic</h3>
                      <button
                        onClick={() => setEditingTopic(null)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {renderTopicFields(editingTopic, (f) =>
                      setEditingTopic({ ...f, id: editingTopic.id })
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleUpdateTopic}
                        className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium"
                      >
                        <Save className="w-4 h-4 inline mr-1" /> Update
                      </button>
                      <button
                        onClick={() => setEditingTopic(null)}
                        className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Topics grouped by course */}
              {courses.map((c) => {
                const ct = getTopicsForCourse(c.id);
                if (ct.length === 0) return null;
                return (
                  <div key={c.id} className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {c.icon} {c.name}
                    </h3>
                    <div className="space-y-1">
                      {ct.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                              {t.order}
                            </span>
                            <div>
                              <span className="text-sm font-medium text-foreground">{t.title}</span>
                              {t.section && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({t.section})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setEditingTopic({ ...topicToForm(t), id: t.id })
                              }
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTopic(t.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}