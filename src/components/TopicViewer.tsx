import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Bookmark,
  Lightbulb, AlertTriangle, Globe, Laugh, Zap, Code2,
  ListOrdered, FileText, Rocket, Trophy, PenTool, Brain
} from "lucide-react";
import { Topic } from "@/data/courses";
import { useLearning } from "@/context/LearningContext";
import CodeBlock from "./CodeBlock";
import QuizBlock from "./QuizBlock";

interface Props {
  topic: Topic;
  topics: Topic[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

function hljsLanguageForCourse(courseId: string): "python" | "java" | "javascript" | "cpp" | "plaintext" {
  switch (courseId) {
    case "python":
      return "python";
    case "java":
      return "java";
    case "javascript":
      return "javascript";
    case "cpp":
      return "cpp";
    default:
      return "plaintext";
  }
}

function SectionCard({ icon: Icon, title, color, children }: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card overflow-hidden`}>
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-border ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function TopicViewer({ topic, topics, currentIndex, onNavigate }: Props) {
  const { completedTopics, bookmarkedTopics, toggleComplete, toggleBookmark } = useLearning();
  const codeLang = hljsLanguageForCourse(topic.courseId);
  const isCompleted = completedTopics.includes(topic.id);
  const isBookmarked = bookmarkedTopics.includes(topic.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < topics.length - 1;

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">
              Topic {currentIndex + 1} of {topics.length}
            </span>
            {topic.section && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {topic.section}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(topic.id)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? "text-warning bg-warning/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => toggleComplete(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isCompleted ? "text-success bg-success/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? "Completed" : "Mark complete"}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full gradient-bg transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / topics.length) * 100}%` }}
          />
        </div>

        {/* ── 1. Title & Intro ── */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{topic.title}</h1>
          {topic.intro && (
            <p className="text-lg text-muted-foreground leading-relaxed">{topic.intro}</p>
          )}
        </div>

        {/* ── 2. Concept Explanation ── */}
        {topic.content && (
          <SectionCard icon={FileText} title="Concept Explanation" color="bg-primary/5 text-primary">
            <div className="space-y-3">
              {topic.content.split("\n\n").map((p, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed">{p}</p>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 3. Syntax ── */}
        {topic.syntax && (
          <SectionCard icon={Code2} title="Syntax" color="bg-accent/60 text-accent-foreground">
            <pre className="rounded-lg p-3 overflow-x-auto bg-[#0d1117] border border-[#30363d]">
              <code className="text-sm font-mono text-[#e6edf3] whitespace-pre">{topic.syntax}</code>
            </pre>
          </SectionCard>
        )}

        {/* ── 4. Step-by-Step Execution ── */}
        {topic.steps && topic.steps.length > 0 && (
          <SectionCard icon={ListOrdered} title="Step-by-Step Execution" color="bg-warning/10 text-warning">
            <ol className="space-y-2">
              {topic.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80 text-sm leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </SectionCard>
        )}

        {/* ── 5. Code Sections ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Code Examples
          </h3>
          {/* Basic Code */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">💻 Basic Code</p>
            <CodeBlock code={topic.code} output={topic.output} language={codeLang} />
          </div>
          {/* Optimized Code */}
          {topic.optimizedCode && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">⚡ Optimized Code</p>
              <CodeBlock code={topic.optimizedCode} output="" language={codeLang} />
            </div>
          )}
          {/* Advanced Code */}
          {topic.advancedCode && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">🚀 Advanced Use Case</p>
              <CodeBlock code={topic.advancedCode} output="" language={codeLang} />
            </div>
          )}
          {topic.extraCodes?.map((block, i) => (
            <div key={`extra-${i}-${block.label}`}>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">{block.label || `Example ${i + 1}`}</p>
              <CodeBlock code={block.code} output={block.output ?? ""} language={codeLang} />
            </div>
          ))}
        </div>

        {/* ── 6. Real-World Example ── */}
        {topic.realWorld && (
          <SectionCard icon={Globe} title="Real-World Usage" color="bg-success/10 text-success">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.realWorld}</p>
          </SectionCard>
        )}

        {/* ── 7. Fun Fact ── */}
        {topic.funFact && (
          <SectionCard icon={Zap} title="Fun Fact" color="bg-warning/10 text-warning">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.funFact}</p>
          </SectionCard>
        )}

        {/* ── 8. Coding Tip ── */}
        {topic.tip && (
          <SectionCard icon={Lightbulb} title="Coding Tip" color="bg-primary/5 text-primary">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.tip}</p>
          </SectionCard>
        )}

        {/* ── 9. Common Mistakes ── */}
        {topic.mistakes && topic.mistakes.length > 0 && (
          <SectionCard icon={AlertTriangle} title="Common Mistakes" color="bg-destructive/10 text-destructive">
            <ul className="space-y-2">
              {topic.mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-destructive mt-0.5">✗</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* ── 10. Quiz ── */}
        <QuizBlock topicId={topic.id} />

        {/* ── 11. Practice Question ── */}
        {topic.practice && (
          <SectionCard icon={PenTool} title="Practice Question" color="bg-primary/5 text-primary">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.practice}</p>
          </SectionCard>
        )}

        {/* ── 12. Challenge Problem ── */}
        {topic.challenge && (
          <SectionCard icon={Trophy} title="Challenge Problem 🔥" color="bg-warning/10 text-warning">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.challenge}</p>
          </SectionCard>
        )}

        {/* ── 13. Joke ── */}
        {topic.joke && (
          <SectionCard icon={Laugh} title="Programming Joke 😂" color="bg-accent/60 text-accent-foreground">
            <p className="text-foreground/80 text-sm leading-relaxed">{topic.joke}</p>
          </SectionCard>
        )}

        {/* ── 14. Summary ── */}
        {topic.summary && (
          <SectionCard icon={Brain} title="Summary" color="bg-success/10 text-success">
            <p className="text-foreground/80 text-sm leading-relaxed font-medium">{topic.summary}</p>
          </SectionCard>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <button
            onClick={() => hasPrev && onNavigate(currentIndex - 1)}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              hasPrev
                ? "bg-secondary text-foreground hover:bg-muted"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => hasNext && onNavigate(currentIndex + 1)}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              hasNext
                ? "gradient-bg text-primary-foreground hover:opacity-90 shadow-md"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
