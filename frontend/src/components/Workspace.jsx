import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function Workspace({ task, onSubmit, evaluating, result }) {
  const [activeTab, setActiveTab] = useState("html");

  const [frontendCode, setFrontendCode] = useState({
    html: "<div id='root'>Hello NEXEL</div>",
    css: "body { background: #000; color: white; font-family: sans-serif; }",
    js: "console.log('NEXEL running');",
  });

  const [backendCode, setBackendCode] = useState(
    "console.log('server running...');",
  );

  const [pmText, setPmText] = useState("");

  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState([]);

  // 🔥 LIVE FRONTEND ENGINE FIX
  useEffect(() => {
    if (task?.category !== "frontend") return;

    const timeout = setTimeout(() => {
      setSrcDoc(`
<!DOCTYPE html>
<html>
  <head>
    <style>${frontendCode.css}</style>
  </head>
  <body>
    ${frontendCode.html}

    <script>
      try {
        ${frontendCode.js}
      } catch (e) {
        document.body.innerHTML += "<pre style='color:red;'>" + e.message + "</pre>";
      }
    </script>
  </body>
</html>
      `);
    }, 300);

    return () => clearTimeout(timeout);
  }, [frontendCode.html, frontendCode.css, frontendCode.js, task]);

  // 🔥 BACKEND SIMULATOR FIXED
  const runBackend = () => {
    setLogs([]);

    const fakeConsole = {
      log: (...args) => {
        setLogs((p) => [...p, args.join(" ")]);
      },
    };

    try {
      const wrappedCode = `
        const console = arguments[0];
        ${backendCode}
      `;

      new Function(wrappedCode)(fakeConsole);

      setLogs((p) => [
        ...p,
        "✔ server running on port 5000",
        "GET /health 200 OK",
      ]);
    } catch (e) {
      setLogs((p) => [...p, `[ERROR] ${e.message}`]);
    }
  };

  const handleSubmit = () => {
    let content = "";

    if (task.category === "frontend") {
      content = JSON.stringify(frontendCode);
    }

    if (task.category === "backend") {
      content = backendCode;
    }

    if (task.category === "pm") {
      content = pmText;
    }

    onSubmit(content);
  };

  if (!task) {
    return <div className="nexel-empty">Select a task to open workspace</div>;
  }

  return (
    <div className="workspace-shell">
      {/* HEADER */}
      <div className="workspace-header">
        <div className="task-category-tag">{task.category}</div>

        <h2 className="nexel-active-title">{task.title}</h2>

        <button
          onClick={handleSubmit}
          className="workspace-submit"
          disabled={evaluating}
        >
          {evaluating ? "Running AI..." : "Submit Code"}
        </button>
      </div>

      <div className="workspace-grid">
        {/* LEFT */}
        <div className="workspace-left">
          {task.category === "frontend" && (
            <div className="panel">
              <div className="panel-title">LIVE PREVIEW</div>

              <iframe title="preview" srcDoc={srcDoc} sandbox="allow-scripts" />
            </div>
          )}

          {task.category === "backend" && (
            <div className="panel terminal">
              <div className="panel-title">SERVER OUTPUT</div>

              {logs.map((l, i) => (
                <div key={i} className="log-line">
                  {l}
                </div>
              ))}
            </div>
          )}

          {task.category === "pm" && (
            <div className="panel">
              <div className="panel-title">DOCUMENT PREVIEW</div>
              <div className="pm-preview">{pmText || "..."}</div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="workspace-right">
          {task.category === "frontend" && (
            <div className="editor-fixed">
              <div className="tab-bar">
                {["html", "css", "js"].map((t) => (
                  <button
                    key={t}
                    className={`tab-btn ${activeTab === t ? "active" : ""}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <Editor
                height="100%"
                theme="vs-dark"
                language={activeTab === "js" ? "javascript" : activeTab}
                value={frontendCode[activeTab]}
                onChange={(val) =>
                  setFrontendCode((p) => ({ ...p, [activeTab]: val }))
                }
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          )}

          {task.category === "backend" && (
            <div className="editor-fixed backend-layout">
              <div className="tab-bar">
                <span className="tab-static-title">server.js</span>
                <button onClick={runBackend} className="run-code-btn">
                  Run
                </button>
              </div>

              <Editor
                height="100%"
                theme="vs-dark"
                language="javascript"
                value={backendCode}
                onChange={setBackendCode}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                }}
              />
            </div>
          )}

          {task.category === "pm" && (
            <textarea
              className="pm-editor-fixed"
              value={pmText}
              onChange={(e) => setPmText(e.target.value)}
              placeholder="System design / specs / roadmap..."
            />
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className="nexel-result">
          <div className="nexel-result-top">
            <span>Result</span>
            <span className="accent">
              {result.score} / {task.points}
            </span>
          </div>

          <div>{result.feedback}</div>
        </div>
      )}
    </div>
  );
}
