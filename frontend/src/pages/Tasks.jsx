import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Workspace from "../components/Workspace";

export default function Tasks() {
  const { token, refreshProfile } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://nexel-platform.onrender.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token]);

  const submit = async (content) => {
    if (!activeTask) return; // hard safety guard

    setEvaluating(true);
    setResult(null);

    try {
      const res = await fetch("https://nexel-platform.onrender.com/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: activeTask.id,
          content,
        }),
      });

      const data = await res.json();

      setResult(data);
      refreshProfile();
    } catch (e) {
      setResult({
        score: 0,
        feedback: "Submission failed",
        strengths: "-",
        weaknesses: "-",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const categories = ["frontend", "backend", "pm"];

  return (
    <div className="nexel">
      <div className="nexel-grid">
        {/* LEFT */}
        <div className="nexel-backlog">
          {loading && <div className="nexel-empty">Loading tasks...</div>}

          {error && <div className="nexel-empty">{error}</div>}

          {!loading &&
            !error &&
            categories.map((cat) => (
              <div key={cat}>
                <div className="nexel-section-title">{cat}</div>

                {(tasks || [])
                  .filter((t) => t.category === cat)
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`nexel-task-item ${
                        activeTask?.id === task.id ? "active" : ""
                      } ${task.difficulty}`}
                      onClick={() => {
                        setActiveTask(task);
                        setResult(null);
                      }}
                    >
                      {/* HEADER */}
                      <div className="nexel-task-top">
                        <div className="nexel-task-id">#{task.id}</div>

                        <div className={`nexel-badge ${task.difficulty}`}>
                          {task.difficulty}
                        </div>
                      </div>

                      {/* TITLE */}
                      <div className="nexel-task-name">{task.title}</div>

                      {/* DESCRIPTION */}
                      <div className="nexel-task-desc">
                        {task.description?.slice(0, 90)}
                        {task.description?.length > 90 ? "..." : ""}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        {/* RIGHT */}
        <Workspace
          task={activeTask}
          onSubmit={submit}
          evaluating={evaluating}
          result={result}
        />
      </div>
    </div>
  );
}
