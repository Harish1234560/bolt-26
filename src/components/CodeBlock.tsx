import { useState, useEffect, useRef } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("plaintext", plaintext);

/** Dark panel works in both light and dark app themes so github-dark token colors stay readable. */
const panel = "bg-[#0d1117] border-[#30363d]";
const panelText = "text-[#8b949e]";

export default function CodeBlock({
  code,
  output,
  language = "plaintext",
}: {
  code: string;
  output: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border overflow-hidden ${panel}`}>
        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${panel} border-[#30363d]`}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className={`text-xs font-medium ml-2 ${panelText}`}>Code</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs ${panelText} hover:text-[#e6edf3] transition-colors px-2 py-1 rounded-md hover:bg-white/5`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className={`p-4 overflow-x-auto !m-0 ${panel}`}>
          <code
            ref={codeRef}
            className={`hljs language-${language} text-sm font-mono leading-relaxed !bg-transparent !p-0`}
          >
            {code}
          </code>
        </pre>
      </div>

      {output && (
        <div className={`rounded-xl border overflow-hidden ${panel}`}>
          <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-[#30363d] ${panel}`}>
            <Terminal className="w-3.5 h-3.5 text-[#3fb950]" />
            <span className={`text-xs font-medium ${panelText}`}>Output</span>
          </div>
          <pre className={`p-4 ${panel}`}>
            <code className="text-sm font-mono text-[#7ee787] leading-relaxed whitespace-pre">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
