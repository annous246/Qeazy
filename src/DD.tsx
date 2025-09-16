import {
  useState,
  useCallback,
  DragEvent,
  ChangeEvent,
  useEffect,
} from "react";
import "./App.css";
import axios from "axios";
import Bg from "./bg/bg";
import Loading from "./Loading";

interface UploadedFile {
  file: File;
  preview?: string;
}

function DD({
  setQuestions,
  setGenerate,
}: {
  setQuestions: any;
  setGenerate: any;
}) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);

  // Handle file drop
  useEffect(() => {
    console.log(uploadedFiles.length);
  }, [uploadedFiles]);
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(uploadedFiles.length);
    if (uploadedFiles.length > 0) return;
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    let pdfFiles = files.filter((file) => file.type === "application/pdf");
    const nonPdfFiles = files.filter((file) => file.type !== "application/pdf");

    if (nonPdfFiles.length > 0) {
      alert(
        "Only PDF files are supported. Ignored: " +
          nonPdfFiles.map((f) => f.name).join(", ")
      );
    }

    if (pdfFiles.length > 0) {
      //forcing one file
      pdfFiles = [pdfFiles[0]];
      const newFiles: UploadedFile[] = pdfFiles.map((file) => ({ file }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Handle drag over
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle manual file selection
  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    const nonPdfFiles = files.filter((file) => file.type !== "application/pdf");

    if (nonPdfFiles.length > 0) {
      alert(
        "Only PDF files are supported. Ignored: " +
          nonPdfFiles.map((f) => f.name).join(", ")
      );
    }

    if (pdfFiles.length > 0) {
      const newFiles: UploadedFile[] = pdfFiles.map((file) => ({ file }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  }, []);

  // Handle file removal
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Process files
  async function getResults(uploadedFiles: any) {
    let response: any[] = [];
    const formData = new FormData();
    for (const uf of uploadedFiles) {
      formData.append("pdf", uf.file);
    }
    formData.append(
      "difficulty",
      level == 1 ? "Easy" : level == 2 ? "Medium" : "Hard"
    );
    formData.append("questions", JSON.stringify(level * 10));
    formData.append("choices", JSON.stringify(level + 2));
    await axios
      .post("https://qeazy-api.onrender.com/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        console.log(res);
        await response.push(...res.data["mcqs"]);
      })
      .catch((e) => console.log(e.message));

    console.log("response", response);
    return response;
  }

  const processFiles = async () => {
    setLoading(true);
    if (uploadedFiles.length === 0) {
      alert("No PDF files uploaded!");
      return;
    }
    console.log(
      "Processing PDFs:",
      uploadedFiles.map((uf) => uf.file)
    );

    const results = await getResults(uploadedFiles);
    await setQuestions((prev: any) => {
      const r = results.map((res: any, index: number) => {
        let answers = [res.answer1, res.answer2, res.answer3];
        if (res.hasOwnProperty("answer4")) {
          answers.push(res.answer4);
        }
        if (res.hasOwnProperty("answer5")) {
          answers.push(res.answer5);
        }
        return {
          id: index.toString(),
          correctAnswer: res.correct,
          text: res.question,
          options: answers,
        };
      });
      console.log(r);
      console.log("broooooooooo");
      return r;
    });

    setLoading(false);
    setGenerate(true);
  };
  return (
    <div className="app-container">
      {loading && <Loading />}
      <Bg />

      {/* Main Content */}
      <div className="main-container">
        <div className="main-content">
          <h1>Upload it. Quiz it. Master it.</h1>
          <div>
            <h4>Level</h4>
            <div>
              <button style={{ margin: "1em" }} onClick={() => setLevel(1)}>
                Easy
              </button>
              <button style={{ margin: "1em" }} onClick={() => setLevel(2)}>
                Medium
              </button>
              <button onClick={() => setLevel(3)}>Hard</button>
            </div>
            <div>
              <ul style={{ listStyle: "none" }}>
                <li>
                  <strong>{level * 10}</strong> Questions
                </li>
                <li>
                  <strong>{level + 2}</strong> Choices
                </li>
                <li>
                  Difficulty {" : "}
                  <strong>
                    {level == 1 ? "Easy" : level == 2 ? "Medium" : "Hard"}
                  </strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`drop-zone ${isDragging ? "drop-zone-active" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <p className="drop-zone-text">Drag and drop PDF files here</p>
            <p className="drop-zone-subtext">or</p>
            <label htmlFor="fileInput" className="select-button">
              Select PDF Files
            </label>
            <br />
            <input
              disabled={uploadedFiles.length > 0}
              style={{
                textAlign: "center",
                margin: "1em",
              }}
              id="fileInput"
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="file-input"
            />
            <p className="drop-zone-note">Supports .pdf files only</p>
            <a
              style={{
                backgroundColor: "#233d756c",
                padding: "0.7em",
                position: "relative",
                minHeight: "3em",
                borderRadius: "0.1em",
              }}
              href="https://www.freepdfconvert.com/"
              target="_blank"
            >
              To PDF Free Converter
            </a>
            <p className="drop-zone-note"></p>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="file-list" style={{ marginTop: "5em" }}>
              <h2>Uploaded PDFs ({uploadedFiles.length})</h2>
              <p>(For Now You Can Only Upload 1 Small PDF at a time)</p>
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{uploadedFile.file.name}</span>
                    <span className="file-size">
                      ({(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-button"
                    style={{ margin: "1em" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Process Button */}
          {uploadedFiles.length > 0 && (
            <button onClick={processFiles} className="process-button">
              Start Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DD;
