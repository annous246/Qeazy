import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import "./Parallax.css";
import Bg from "../bg/bg";

function Parallax() {
  // Handle file drop
  return (
    <div className="app-container-about">
      <Bg />

      {/* Main Content */}
      <div className="main-container-about">
        <h1>About Us</h1>
        <p>
          Welcome to Qeazy, your intelligent study companion! We leverage the
          power of OpenAI’s advanced AI to transform your PDFs into interactive
          learning experiences. Upload any document, and our platform will read,
          analyze, and split it into key sections, automatically generating
          quizzes to help you retain knowledge efficiently. Our mission is to
          make learning smarter and faster by combining AI-powered understanding
          with user-friendly tools. Whether you’re a student, professional, or
          lifelong learner, Qeazy helps you study smarter, not harder.
          <h3>Key Features:</h3>
          <ul style={{ listStyle: "none" }}>
            <li>Instant PDF reading and comprehension.</li>
            <li>Automated content splitting into meaningful sections.</li>
            <li>
              AI-generated multiple-choice quizzes to test your understanding.
            </li>
            <li>Clean, intuitive interface for seamless learning.</li>
          </ul>
          <p style={{ fontSize: "0.9em", fontWeight: "100", marginTop: "7em" }}>
            We believe that technology should empower education, and with Qeazy,
            you can turn any
          </p>
        </p>
      </div>
    </div>
  );
}

export default Parallax;
