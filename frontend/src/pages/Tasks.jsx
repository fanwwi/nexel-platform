import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const { token, refreshProfile } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleSubmitting = async (e) => {
    e.preventDefault();
    setEvaluating(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: activeTask.id,
          content: submissionContent,
        }),
      });
      const data = await res.json();
      setResult(data);
      setSubmissionContent("");
      refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const categories = ["frontend", "backend", "pm"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-8 text-white">
        Tracks Architecture Backlog
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {categories.map((cat) => (
            <div key={cat} className="space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-[#222222] pb-1">
                {cat} tracks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks
                  .filter((t) => t.category === cat)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#121212] border border-[#222222] p-5 rounded flex flex-col justify-between hover:border-[#ff6600]/40 transition"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {task.title}
                          </h3>
                          <span className="bg-[#1c1c1c] border border-[#333333] px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded text-gray-400">
                            {task.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-3 mb-4">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-bold text-[#ff6600]">
                          {task.points} System Points
                        </span>
                        <button
                          onClick={() => {
                            setActiveTask(task);
                            setResult(null);
                          }}
                          className="bg-[#1c1c1c] border border-[#333333] hover:border-[#ff6600] text-xs font-bold px-3 py-1.5 rounded transition text-white"
                        >
                          Select Node
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          {activeTask ? (
            <div className="bg-[#121212] border border-[#ff6600]/40 p-6 rounded-lg space-y-4 sticky top-24">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6600] bg-[#ff6600]/10 border border-[#ff6600]/20 px-2 py-0.5 rounded">
                  {activeTask.category}
                </span>
                <h2 className="text-xl font-bold mt-2 text-white">
                  {activeTask.title}
                </h2>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  {activeTask.description}
                </p>
              </div>

              <form onSubmit={handleSubmitting} className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Submission payload (Text or GitHub Repository URL)
                </label>
                <textarea
                  rows="4"
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  required
                  placeholder="Provide direct code solutions or explicit production repository target references..."
                  className="w-full bg-[#1c1c1c] border border-[#333333] rounded p-3 text-xs text-white focus:outline-none focus:border-[#ff6600]"
                />
                <button
                  type="submit"
                  disabled={evaluating}
                  className="w-full bg-[#ff6600] text-black font-bold py-2.5 text-xs rounded uppercase tracking-wider hover:bg-[#e65c00] transition disabled:opacity-50"
                >
                  {evaluating
                    ? "Engaging Automated AI Processing Pipeline..."
                    : "Deploy Submission to AI"}
                </button>
              </form>

              {result && (
                <div className="bg-[#1c1c1c] border border-[#2d2d2d] p-4 rounded text-xs space-y-2 mt-4">
                  <div className="flex justify-between items-center border-b border-[#2d2d2d] pb-2">
                    <span className="font-bold uppercase text-gray-400">
                      Evaluation Yield
                    </span>
                    <span className="text-emerald-400 font-black text-sm">
                      {result.score} / {activeTask.points} Pts
                    </span>
                  </div>
                  <p className="text-gray-300 italic">"{result.feedback}"</p>
                  <p>
                    <strong className="text-emerald-400">
                      Core Stringths:
                    </strong>{" "}
                    {result.strengths}
                  </p>
                  <p>
                    <strong class="text-[#ff6600]">
                      Identified Deficiencies:
                    </strong>{" "}
                    {result.weaknesses}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#121212] border border-[#222222] border-dashed p-8 rounded-lg text-center text-gray-500 text-sm sticky top-24">
              Select a task vector component structure configuration profile
              node from the matrix backlog view mapping to open full submission
              operations parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
