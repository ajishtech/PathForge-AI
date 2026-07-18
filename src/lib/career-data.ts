export const CAREER_ROLES = [
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "Cloud Architect",
  "Machine Learning Engineer",
] as const;

export type CareerRole = (typeof CAREER_ROLES)[number];

export const ROLE_SKILLS: Record<CareerRole, string[]> = {
  "Full-Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
    "MongoDB", "SQL", "Git", "Docker", "AWS", "TypeScript",
    "REST APIs", "Authentication", "CI/CD", "GitHub Actions",
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS",
    "Next.js", "Git", "Responsive Design", "Accessibility", "Testing",
  ],
  "Backend Developer": [
    "Node.js", "Python", "SQL", "PostgreSQL", "MongoDB", "REST APIs",
    "GraphQL", "Docker", "AWS", "Authentication", "Microservices", "Git",
  ],
  "Data Scientist": [
    "Python", "SQL", "Statistics", "Machine Learning", "Pandas",
    "NumPy", "Scikit-learn", "TensorFlow", "Data Visualization", "Jupyter",
  ],
  "DevOps Engineer": [
    "Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Terraform",
    "GitHub Actions", "Monitoring", "Networking", "Scripting", "Ansible",
  ],
  "Mobile Developer": [
    "React Native", "Swift", "Kotlin", "JavaScript", "TypeScript",
    "REST APIs", "Git", "Mobile UI/UX", "Firebase", "App Store Deployment",
  ],
  "Cloud Architect": [
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
    "Networking", "Security", "Serverless", "CI/CD", "Monitoring",
  ],
  "Machine Learning Engineer": [
    "Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
    "MLOps", "Docker", "AWS", "SQL", "Statistics", "Data Engineering",
  ],
};

export const ROADMAP_TEMPLATES: Record<CareerRole, Array<{
  title: string;
  description: string;
  difficulty: string;
  estimatedHours: number;
  resources: string[];
  projects: string[];
}>> = {
  "Full-Stack Developer": [
    { title: "HTML & CSS Fundamentals", description: "Learn semantic HTML and modern CSS including Flexbox and Grid", difficulty: "Beginner", estimatedHours: 20, resources: ["freeCodeCamp Responsive Web Design", "MDN Web Docs"], projects: ["Personal landing page", "CSS art project"] },
    { title: "JavaScript Essentials", description: "Master JS fundamentals, DOM manipulation, and ES6+ features", difficulty: "Beginner", estimatedHours: 40, resources: ["JavaScript.info", "Eloquent JavaScript"], projects: ["Todo app", "Weather app"] },
    { title: "Git & Version Control", description: "Learn branching, merging, and collaborative workflows", difficulty: "Beginner", estimatedHours: 10, resources: ["GitHub Skills", "Pro Git book"], projects: ["Contribute to open source"] },
    { title: "React Fundamentals", description: "Components, hooks, state management, and routing", difficulty: "Intermediate", estimatedHours: 40, resources: ["React docs", "Scrimba React course"], projects: ["E-commerce UI", "Dashboard app"] },
    { title: "Node.js & Express", description: "Build REST APIs with Node.js and Express framework", difficulty: "Intermediate", estimatedHours: 30, resources: ["Node.js docs", "Express guide"], projects: ["Blog API", "Task manager API"] },
    { title: "Database & MongoDB", description: "SQL basics and NoSQL with MongoDB", difficulty: "Intermediate", estimatedHours: 25, resources: ["MongoDB University", "SQLBolt"], projects: ["Database design project"] },
    { title: "Authentication & Security", description: "JWT, OAuth, and web security best practices", difficulty: "Intermediate", estimatedHours: 20, resources: ["OWASP guidelines", "Auth0 docs"], projects: ["Secure login system"] },
    { title: "Docker & Containerization", description: "Containerize applications with Docker", difficulty: "Advanced", estimatedHours: 15, resources: ["Docker docs", "Play with Docker"], projects: ["Dockerize your app"] },
    { title: "Deployment & CI/CD", description: "Deploy to cloud and set up automated pipelines", difficulty: "Advanced", estimatedHours: 20, resources: ["Vercel docs", "GitHub Actions"], projects: ["Deploy full-stack app"] },
    { title: "AWS Cloud Basics", description: "Learn core AWS services for web applications", difficulty: "Advanced", estimatedHours: 30, resources: ["AWS Free Tier", "A Cloud Guru"], projects: ["Host app on AWS"] },
  ],
  "Frontend Developer": [
    { title: "HTML & CSS Mastery", description: "Advanced CSS, animations, and responsive design", difficulty: "Beginner", estimatedHours: 30, resources: ["CSS Tricks", "Frontend Masters"], projects: ["Portfolio site"] },
    { title: "JavaScript Deep Dive", description: "Closures, prototypes, async/await, and modules", difficulty: "Intermediate", estimatedHours: 40, resources: ["You Don't Know JS", "JavaScript.info"], projects: ["Interactive widgets"] },
    { title: "React & Next.js", description: "Modern React with SSR and app router", difficulty: "Intermediate", estimatedHours: 50, resources: ["Next.js docs", "React docs"], projects: ["Blog with Next.js"] },
    { title: "TypeScript", description: "Type-safe JavaScript for large applications", difficulty: "Intermediate", estimatedHours: 20, resources: ["TypeScript handbook"], projects: ["Convert JS project to TS"] },
    { title: "Testing & Accessibility", description: "Unit testing, E2E testing, and a11y standards", difficulty: "Advanced", estimatedHours: 25, resources: ["Testing Library", "WCAG guidelines"], projects: ["Accessible component library"] },
  ],
  "Backend Developer": [
    { title: "Programming Fundamentals", description: "Choose Python or Node.js and master basics", difficulty: "Beginner", estimatedHours: 40, resources: ["Python.org tutorial", "Node.js docs"], projects: ["CLI tool"] },
    { title: "SQL & Database Design", description: "Relational databases, queries, and schema design", difficulty: "Intermediate", estimatedHours: 30, resources: ["SQLBolt", "PostgreSQL tutorial"], projects: ["Database schema design"] },
    { title: "REST API Development", description: "Design and build scalable REST APIs", difficulty: "Intermediate", estimatedHours: 35, resources: ["REST API tutorial", "Postman docs"], projects: ["CRUD API with auth"] },
    { title: "Microservices Architecture", description: "Design distributed systems and services", difficulty: "Advanced", estimatedHours: 40, resources: ["Microservices patterns book"], projects: ["Multi-service app"] },
    { title: "Docker & Kubernetes", description: "Container orchestration for production", difficulty: "Advanced", estimatedHours: 30, resources: ["Kubernetes docs"], projects: ["Deploy microservices"] },
  ],
  "Data Scientist": [
    { title: "Python for Data Science", description: "Python basics with focus on data manipulation", difficulty: "Beginner", estimatedHours: 30, resources: ["Python for Everybody", "Kaggle Learn"], projects: ["Data cleaning script"] },
    { title: "Statistics & Probability", description: "Core statistical concepts for data analysis", difficulty: "Intermediate", estimatedHours: 40, resources: ["Khan Academy Statistics", "StatQuest"], projects: ["Statistical analysis report"] },
    { title: "Machine Learning Basics", description: "Supervised and unsupervised learning algorithms", difficulty: "Intermediate", estimatedHours: 50, resources: ["Andrew Ng ML course", "Scikit-learn docs"], projects: ["Prediction model"] },
    { title: "Deep Learning", description: "Neural networks with TensorFlow/PyTorch", difficulty: "Advanced", estimatedHours: 60, resources: ["Fast.ai", "Deep Learning book"], projects: ["Image classifier"] },
  ],
  "DevOps Engineer": [
    { title: "Linux & Shell Scripting", description: "Command line mastery and bash scripting", difficulty: "Beginner", estimatedHours: 25, resources: ["Linux Journey", "Bash guide"], projects: ["Automation scripts"] },
    { title: "Docker Fundamentals", description: "Containerization and Docker Compose", difficulty: "Intermediate", estimatedHours: 20, resources: ["Docker docs"], projects: ["Multi-container app"] },
    { title: "CI/CD Pipelines", description: "Automated testing and deployment pipelines", difficulty: "Intermediate", estimatedHours: 25, resources: ["GitHub Actions", "Jenkins docs"], projects: ["Full CI/CD pipeline"] },
    { title: "Kubernetes", description: "Container orchestration at scale", difficulty: "Advanced", estimatedHours: 40, resources: ["Kubernetes.io", "CKA prep"], projects: ["K8s deployment"] },
    { title: "Infrastructure as Code", description: "Terraform and cloud infrastructure automation", difficulty: "Advanced", estimatedHours: 30, resources: ["Terraform docs", "AWS docs"], projects: ["IaC project"] },
  ],
  "Mobile Developer": [
    { title: "JavaScript & React Native", description: "Cross-platform mobile development basics", difficulty: "Beginner", estimatedHours: 40, resources: ["React Native docs", "Expo docs"], projects: ["Weather app"] },
    { title: "Mobile UI/UX Patterns", description: "Platform-specific design patterns and navigation", difficulty: "Intermediate", estimatedHours: 20, resources: ["Material Design", "Human Interface Guidelines"], projects: ["Social media app UI"] },
    { title: "Native Features & APIs", description: "Camera, GPS, push notifications integration", difficulty: "Intermediate", estimatedHours: 25, resources: ["Expo SDK docs"], projects: ["Location-based app"] },
    { title: "App Store Deployment", description: "Publishing to App Store and Google Play", difficulty: "Advanced", estimatedHours: 15, resources: ["Apple Developer docs", "Google Play Console"], projects: ["Publish your app"] },
  ],
  "Cloud Architect": [
    { title: "Cloud Computing Fundamentals", description: "IaaS, PaaS, SaaS and cloud service models", difficulty: "Beginner", estimatedHours: 20, resources: ["AWS Cloud Practitioner", "Azure Fundamentals"], projects: ["Cloud comparison report"] },
    { title: "AWS Core Services", description: "EC2, S3, RDS, Lambda, and VPC", difficulty: "Intermediate", estimatedHours: 40, resources: ["AWS Solutions Architect", "A Cloud Guru"], projects: ["Multi-tier architecture"] },
    { title: "Security & Compliance", description: "Cloud security best practices and IAM", difficulty: "Advanced", estimatedHours: 30, resources: ["AWS Security docs", "CIS benchmarks"], projects: ["Secure cloud setup"] },
    { title: "Serverless Architecture", description: "Lambda, API Gateway, and event-driven design", difficulty: "Advanced", estimatedHours: 25, resources: ["Serverless Framework docs"], projects: ["Serverless API"] },
  ],
  "Machine Learning Engineer": [
    { title: "Python & Math Foundations", description: "Linear algebra, calculus, and Python for ML", difficulty: "Beginner", estimatedHours: 40, resources: ["3Blue1Brown", "Python ML book"], projects: ["Math visualization tool"] },
    { title: "ML Algorithms & Training", description: "Model training, evaluation, and hyperparameter tuning", difficulty: "Intermediate", estimatedHours: 50, resources: ["Fast.ai", "Hands-On ML"], projects: ["Custom ML pipeline"] },
    { title: "Deep Learning Frameworks", description: "TensorFlow and PyTorch for production models", difficulty: "Advanced", estimatedHours: 45, resources: ["PyTorch tutorials", "TF docs"], projects: ["NLP model"] },
    { title: "MLOps & Deployment", description: "Model serving, monitoring, and CI/CD for ML", difficulty: "Advanced", estimatedHours: 35, resources: ["MLflow docs", "Kubeflow"], projects: ["End-to-end ML pipeline"] },
  ],
};

export const COURSE_CATALOG = [
  { title: "Responsive Web Design", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", level: "Beginner", duration: "300 hours", isFree: true, skills: ["HTML", "CSS"] },
  { title: "JavaScript Algorithms and Data Structures", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", level: "Beginner", duration: "300 hours", isFree: true, skills: ["JavaScript"] },
  { title: "React - The Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide/", level: "Intermediate", duration: "48 hours", isFree: false, skills: ["React", "JavaScript"] },
  { title: "Node.js, Express, MongoDB & More", platform: "Udemy", url: "https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/", level: "Intermediate", duration: "42 hours", isFree: false, skills: ["Node.js", "Express.js", "MongoDB"] },
  { title: "Docker and Kubernetes: The Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/", level: "Advanced", duration: "21 hours", isFree: false, skills: ["Docker", "Kubernetes"] },
  { title: "AWS Certified Solutions Architect", platform: "Coursera", url: "https://www.coursera.org/specializations/aws-cloud-solutions-architect", level: "Advanced", duration: "6 months", isFree: false, skills: ["AWS"] },
  { title: "Full Stack Open", platform: "YouTube", url: "https://fullstackopen.com/en/", level: "Intermediate", duration: "12 weeks", isFree: true, skills: ["React", "Node.js", "MongoDB"] },
  { title: "CS50's Introduction to Computer Science", platform: "edX", url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science", level: "Beginner", duration: "12 weeks", isFree: true, skills: ["Programming", "Algorithms"] },
  { title: "Learn Python 3", platform: "Codecademy", url: "https://www.codecademy.com/learn/learn-python-3", level: "Beginner", duration: "25 hours", isFree: false, skills: ["Python"] },
  { title: "Machine Learning Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction", level: "Intermediate", duration: "3 months", isFree: false, skills: ["Machine Learning", "Python"] },
  { title: "TypeScript Course for Beginners", platform: "YouTube", url: "https://www.youtube.com/watch?v=d56mG4SPCDY", level: "Beginner", duration: "1 hour", isFree: true, skills: ["TypeScript"] },
  { title: "Git & GitHub Crash Course", platform: "YouTube", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", level: "Beginner", duration: "1.5 hours", isFree: true, skills: ["Git"] },
];

export const DAILY_GOAL_TEMPLATES = [
  "Learn one new React component pattern",
  "Solve two coding problems on LeetCode",
  "Watch one tutorial on your current roadmap step",
  "Build one mini project feature",
  "Read one technical article",
  "Review and refactor yesterday's code",
  "Practice one system design concept",
  "Update your portfolio with a new project",
  "Complete one module of your current course",
  "Write documentation for a personal project",
];

export const BADGES = [
  { id: "first-step", title: "First Step", description: "Complete your first roadmap step", icon: "🎯" },
  { id: "week-streak", title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "🔥" },
  { id: "skill-master", title: "Skill Master", description: "Reach Advanced in 5 skills", icon: "⭐" },
  { id: "interview-ready", title: "Interview Ready", description: "Score 80%+ on mock interview", icon: "💼" },
  { id: "portfolio-pro", title: "Portfolio Pro", description: "Generate your portfolio website", icon: "🚀" },
  { id: "course-complete", title: "Course Champion", description: "Complete 3 courses", icon: "🏆" },
];
