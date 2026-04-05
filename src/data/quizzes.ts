export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  topicId: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    topicId: "py-1",
    questions: [
      { id: "q-py1-1", question: "Who created Python?", options: ["James Gosling", "Guido van Rossum", "Brendan Eich", "Dennis Ritchie"], correctIndex: 1 },
      { id: "q-py1-2", question: "What type of language is Python?", options: ["Compiled", "Interpreted", "Assembly", "Machine"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-2",
    questions: [
      { id: "q-py2-1", question: "How do you declare a variable in Python?", options: ["var x = 10", "int x = 10", "x = 10", "let x = 10"], correctIndex: 2 },
      { id: "q-py2-2", question: "Which is NOT a Python data type?", options: ["str", "int", "varchar", "bool"], correctIndex: 2 },
    ],
  },
  {
    topicId: "py-3",
    questions: [
      { id: "q-py3-1", question: "What does // do in Python?", options: ["Comment", "Regular division", "Floor division", "Power"], correctIndex: 2 },
      { id: "q-py3-2", question: "What is 10 ** 3?", options: ["30", "1000", "13", "10000"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-4",
    questions: [
      { id: "q-py4-1", question: "Which keyword starts a conditional block?", options: ["for", "while", "if", "def"], correctIndex: 2 },
      { id: "q-py4-2", question: "What replaces braces for code blocks in Python?", options: ["Semicolons", "Indentation", "Brackets", "Parentheses"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-5",
    questions: [
      { id: "q-py5-1", question: "Which loop iterates over a sequence?", options: ["while", "do-while", "for", "switch"], correctIndex: 2 },
      { id: "q-py5-2", question: "What does range(3) produce when iterated?", options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, 2, 1"], correctIndex: 0 },
    ],
  },
  {
    topicId: "py-6",
    questions: [
      { id: "q-py6-1", question: "Which keyword defines a function in Python?", options: ["function", "func", "def", "fn"], correctIndex: 2 },
      { id: "q-py6-2", question: "What is a mutable default argument pitfall?", options: ["Using None as default", "Using [] as default", "Using 0 as default", "Using \"\" as default"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-7",
    questions: [
      { id: "q-py7-1", question: "Which is the preferred way to format strings in modern Python?", options: ["%-formatting", "str.format only", "f-strings", "concatenation with + only"], correctIndex: 2 },
      { id: "q-py7-2", question: "Are Python strings mutable?", options: ["Yes", "No", "Only in Python 2", "Only for ASCII"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-8",
    questions: [
      { id: "q-py8-1", question: "What symbol creates a list?", options: ["()", "{}", "[]", "<>"], correctIndex: 2 },
      { id: "q-py8-2", question: "How do you create a one-element tuple?", options: ["(1)", "(1,)", "[1]", "tuple(1)"], correctIndex: 1 },
    ],
  },
  {
    topicId: "py-9",
    questions: [
      { id: "q-py9-1", question: "What does dict.get('k', 0) return if 'k' is missing?", options: ["KeyError", "0", "None", "False"], correctIndex: 1 },
      { id: "q-py9-2", question: "Which method yields (key, value) pairs?", options: [".keys()", ".values()", ".items()", ".pairs()"], correctIndex: 2 },
    ],
  },
  {
    topicId: "py-10",
    questions: [
      { id: "q-py10-1", question: "Which block always runs after try (even if there was an error)?", options: ["except", "else", "finally", "catch"], correctIndex: 2 },
      { id: "q-py10-2", question: "What exception does 1 / 0 raise?", options: ["ValueError", "ArithmeticError", "ZeroDivisionError", "RuntimeError"], correctIndex: 2 },
    ],
  },
  {
    topicId: "java-1",
    questions: [
      { id: "q-j1-1", question: "What is Java's principle?", options: ["Code Once", "Write Once, Run Anywhere", "Fast Compile", "Low Level"], correctIndex: 1 },
    ],
  },
  {
    topicId: "java-2",
    questions: [
      { id: "q-j2-1", question: "Is Java statically or dynamically typed?", options: ["Dynamically", "Statically", "Both", "Neither"], correctIndex: 1 },
    ],
  },
  {
    topicId: "js-1",
    questions: [
      { id: "q-js1-1", question: "Where does JavaScript primarily run?", options: ["Server only", "Browser", "Database", "OS kernel"], correctIndex: 1 },
    ],
  },
  {
    topicId: "js-2",
    questions: [
      { id: "q-js2-1", question: "Which keyword declares a constant in JS?", options: ["var", "let", "const", "static"], correctIndex: 2 },
    ],
  },
  {
    topicId: "js-3",
    questions: [
      { id: "q-js3-1", question: "What is the ES6 syntax for short functions?", options: ["Lambda", "Arrow functions", "Closures", "Generators"], correctIndex: 1 },
    ],
  },
  {
    topicId: "cpp-1",
    questions: [
      { id: "q-cpp1-1", question: "Who created C++?", options: ["Dennis Ritchie", "Bjarne Stroustrup", "Linus Torvalds", "Ken Thompson"], correctIndex: 1 },
    ],
  },
  {
    topicId: "cpp-3",
    questions: [
      { id: "q-cpp3-1", question: "What does a pointer store?", options: ["A value", "A memory address", "A function", "A string"], correctIndex: 1 },
    ],
  },
];
