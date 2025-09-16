import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import DD from "./DD";
import Parallax from "./paralax/Parallax"; // your new parallax component

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

function App() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generate, setGenerate] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mark, setMark] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number | null;
  }>({});

  useEffect(() => {
    console.log("questions", questions);
  }, [questions]);
  useEffect(() => {
    if (submitted) {
      if (selectedAnswers) {
        for (const ans in selectedAnswers) {
          if (selectedAnswers[ans] == getAnswer(parseInt(ans))) {
            setMark((p) => p + 1);
          }
        }
      }
    }
  }, [submitted]);

  const handleOptionClick = (questionId: number, option: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === option ? null : option,
    }));
  };

  function getAnswer(id: number) {
    const ourQuestion: Question[] = questions.filter((q) => q.id === id);
    return ourQuestion[0].correctAnswer - 1;
  }

  const handleSubmit = () => {
    setSubmitted(true);
  };

  function MCQ() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        <h1 className="text-3xl font-bold mb-8">Multiple Choice Quiz</h1>
        <div className="w-full max-w-2xl space-y-6">
          {questions.map((question, qIndex) => (
            <div
              style={{ marginBottom: "10em" }}
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                {qIndex + 1}. {question.text}
              </h2>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    disabled={submitted}
                    style={{
                      margin: "1em",
                      backgroundColor:
                        selectedAnswers[question.id] === index
                          ? !submitted
                            ? "#139decff"
                            : selectedAnswers[question.id] ===
                              getAnswer(question.id)
                            ? "#099e29ff"
                            : "#a83232ff"
                          : question.correctAnswer === index + 1 && submitted
                          ? "#099e29ff"
                          : "#1A1A1A",
                      width: "80%",
                      maxWidth: "70em",
                      overflow: "hidden",
                      opacity: "1",
                      color: "white",
                    }}
                    key={index}
                    onClick={() => handleOptionClick(question.id, index)}
                    className="w-full text-left p-3 rounded-md border transition-colors duration-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            disabled={submitted}
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            {submitted ? mark + "/" + questions.length : "Submit Quiz"}
          </button>
          {submitted && (
            <button onClick={() => window.location.reload()}>
              Upload Again
            </button>
          )}
        </div>
      </div>
    );
  }

  function Uploader() {
    return <DD setGenerate={setGenerate} setQuestions={setQuestions} />;
  }

  function Home() {
    return generate ? MCQ() : Uploader();
  }

  return (
    <Router>
      {/* Simple Nav */}

      {/* Nav Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src="/assets/logo.png" width={100} />
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="about" className="nav-link">
            About
          </Link>
          <Link
            to="#"
            className="nav-link"
            style={{ color: "#6d6d6db0", cursor: "default" }}
          >
            Contact
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Parallax />} />
      </Routes>
    </Router>
  );
}

export default App;
