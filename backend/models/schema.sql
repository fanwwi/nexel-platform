CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    role VARCHAR(50) DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'frontend', 'backend', 'pm'
    points INT NOT NULL,
    difficulty VARCHAR(50) NOT NULL -- 'Easy', 'Medium', 'Hard'
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    score INT NOT NULL,
    feedback TEXT NOT NULL,
    strengths TEXT NOT NULL,
    weaknesses TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial tasks
INSERT INTO tasks (title, description, category, points, difficulty) VALUES
('Build a Responsive Navbar', 'Create a highly responsive navigation bar using React and Tailwind CSS.', 'frontend', 50, 'Easy'),
('JWT Authentication API', 'Implement a secure Express.js backend API with JWT register and login endpoints.', 'backend', 100, 'Medium'),
('Create an Agile Sprint Roadmap', 'Draft a comprehensive 2-week sprint plan and product backlog for a SaaS platform.', 'pm', 75, 'Medium')
ON CONFLICT DO NOTHING;