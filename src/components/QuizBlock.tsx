import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { quizzes, QuizQuestion } from "@/data/quizzes";
import { useLearning } from "@/context/LearningContext";

interface Props {
  topicId: string;
}

export default function QuizBlock({ topicId }: Props) {
  const quiz = quizzes.find((q) => q.topicId === topicId);
  const { quizScores, saveQuizScore } = useLearning();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz || quiz.questions.length === 0) return null;

  const score = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const total = quiz.questions.length;
  const previousBest = quizScores[topicId] ?? null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < total) return;
    setSubmitted(true);
    saveQuizScore(topicId, score);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
          <Trophy className="w-4.5 h-4.5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Quick Quiz</h3>
          <p className="text-xs text-muted-foreground">
            Test your understanding
            {previousBest !== null && !submitted && ` · Best: ${previousBest}/${total}`}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, qi) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.05 }}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">
              {qi + 1}. {q.question}
            </p>
            <div className="grid gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi;
                const isCorrect = q.correctIndex === oi;
                let style =
                  "border-border text-foreground hover:border-primary/40 hover:bg-primary/5";
                if (submitted) {
                  if (isCorrect) style = "border-success bg-success/10 text-foreground";
                  else if (isSelected && !isCorrect) style = "border-destructive bg-destructive/10 text-foreground";
                  else style = "border-border text-muted-foreground opacity-75";
                } else if (isSelected) {
                  style = "border-primary bg-primary/15 text-foreground";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(q.id, oi)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 leading-snug ${style}`}
                  >
                    <span className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium"
                      style={{ borderColor: "inherit" }}
                    >
                      {submitted && isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       submitted && isSelected && !isCorrect ? <XCircle className="w-3.5 h-3.5" /> :
                       String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < total}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              Object.keys(answers).length >= total
                ? "gradient-bg text-primary-foreground hover:opacity-90 shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
              score === total ? "bg-success/10 text-success" : score >= total / 2 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
            }`}>
              Score: {score}/{total}
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
