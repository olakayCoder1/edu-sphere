export const DASHBOARD_LINKS = {
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: "LayoutDashboard" },
    { label: "Users", href: "/dashboard/admin/users", icon: "Users" },
    { label: "Courses", href: "/dashboard/admin/courses", icon: "BookOpen" },
    { label: "Live Classes", href: "/dashboard/admin/live-classes", icon: "Video" },
    { label: "Reports", href: "/dashboard/admin/reports", icon: "BarChart3" },
    { label: "Settings", href: "/dashboard/admin/settings", icon: "Settings" },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/dashboard/tutor/courses", icon: "BookOpen" },
    { label: "Students", href: "/dashboard/tutor/students", icon: "GraduationCap" },
    { label: "Live Classes", href: "/dashboard/tutor/live-classes", icon: "Video" },
    { label: "Analytics", href: "/dashboard/tutor/analytics", icon: "BarChart3" },
    { label: "Settings", href: "/dashboard/tutor/settings", icon: "Settings" },
  ],
  student: [
    { label: "Overview", href: "/dashboard/student", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/dashboard/student/courses", icon: "BookOpen" },
    { label: "Live Classes", href: "/dashboard/student/live-classes", icon: "Video" },
    { label: "Progress", href: "/dashboard/student/progress", icon: "LineChart" },
    { label: "Certificates", href: "/dashboard/student/certificates", icon: "Award" },
    { label: "Settings", href: "/dashboard/student/settings", icon: "Settings" },
  ],
};

export const DEMO_COURSES = [
  {
    id: "course-1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    tutor: "Dr. Sarah Johnson",
    thumbnail: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
    totalChapters: 12,
    completedChapters: 8,
    progress: 67,
    status: "in-progress",
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.8,
    students: 1243,
    lastAccessed: "2023-11-15T14:30:00Z",
    chapters: [
      { id: "ch-1", title: "HTML Basics", isCompleted: true },
      { id: "ch-2", title: "CSS Fundamentals", isCompleted: true },
      { id: "ch-3", title: "CSS Layout", isCompleted: true },
      { id: "ch-4", title: "Introduction to JavaScript", isCompleted: true },
      { id: "ch-5", title: "DOM Manipulation", isCompleted: true },
      { id: "ch-6", title: "JavaScript Functions", isCompleted: true },
      { id: "ch-7", title: "Event Handling", isCompleted: true },
      { id: "ch-8", title: "Form Validation", isCompleted: true },
      { id: "ch-9", title: "Intro to APIs", isCompleted: false },
      { id: "ch-10", title: "Async JavaScript", isCompleted: false },
      { id: "ch-11", title: "Working with JSON", isCompleted: false },
      { id: "ch-12", title: "Final Project", isCompleted: false },
    ],
  },
  {
    id: "course-2",
    title: "Data Science Fundamentals",
    description: "Master the core concepts of data science, from data analysis to machine learning.",
    tutor: "Prof. Michael Chen",
    thumbnail: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
    totalChapters: 10,
    completedChapters: 3,
    progress: 30,
    status: "in-progress",
    category: "Data Science",
    level: "Intermediate",
    duration: "10 weeks",
    rating: 4.7,
    students: 842,
    lastAccessed: "2023-11-17T09:45:00Z",
    chapters: [
      { id: "ch-1", title: "Introduction to Data Science", isCompleted: true },
      { id: "ch-2", title: "Python for Data Science", isCompleted: true },
      { id: "ch-3", title: "Data Visualization", isCompleted: true },
      { id: "ch-4", title: "Data Cleaning and Preprocessing", isCompleted: false },
      { id: "ch-5", title: "Statistical Analysis", isCompleted: false },
      { id: "ch-6", title: "Introduction to Machine Learning", isCompleted: false },
      { id: "ch-7", title: "Supervised Learning", isCompleted: false },
      { id: "ch-8", title: "Unsupervised Learning", isCompleted: false },
      { id: "ch-9", title: "Deep Learning Basics", isCompleted: false },
      { id: "ch-10", title: "Capstone Project", isCompleted: false },
    ],
  },
  {
    id: "course-3",
    title: "Business Management Essentials",
    description: "Develop core business management skills necessary for today's competitive market.",
    tutor: "Dr. Emily Rodriguez",
    thumbnail: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
    totalChapters: 8,
    completedChapters: 0,
    progress: 0,
    status: "not-started",
    category: "Business",
    level: "All Levels",
    duration: "6 weeks",
    rating: 4.5,
    students: 624,
    lastAccessed: null,
    chapters: [
      { id: "ch-1", title: "Introduction to Management", isCompleted: false },
      { id: "ch-2", title: "Strategic Planning", isCompleted: false },
      { id: "ch-3", title: "Organizational Behavior", isCompleted: false },
      { id: "ch-4", title: "Leadership and Team Management", isCompleted: false },
      { id: "ch-5", title: "Financial Management", isCompleted: false },
      { id: "ch-6", title: "Marketing Fundamentals", isCompleted: false },
      { id: "ch-7", title: "Operations Management", isCompleted: false },
      { id: "ch-8", title: "Business Ethics and CSR", isCompleted: false },
    ],
  },
  {
    id: "course-4",
    title: "UX/UI Design Principles",
    description: "Learn how to create intuitive, user-friendly digital products and interfaces.",
    tutor: "Alex Thompson",
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    totalChapters: 9,
    completedChapters: 9,
    progress: 100,
    status: "completed",
    category: "Design",
    level: "Intermediate",
    duration: "7 weeks",
    rating: 4.9,
    students: 1029,
    lastAccessed: "2023-10-28T16:15:00Z",
    chapters: [
      { id: "ch-1", title: "Introduction to UX Design", isCompleted: true },
      { id: "ch-2", title: "User Research Methods", isCompleted: true },
      { id: "ch-3", title: "Information Architecture", isCompleted: true },
      { id: "ch-4", title: "Wireframing and Prototyping", isCompleted: true },
      { id: "ch-5", title: "Visual Design Principles", isCompleted: true },
      { id: "ch-6", title: "UI Components and Patterns", isCompleted: true },
      { id: "ch-7", title: "Responsive Design", isCompleted: true },
      { id: "ch-8", title: "Usability Testing", isCompleted: true },
      { id: "ch-9", title: "Design Systems", isCompleted: true },
    ],
  },
];

export const DEMO_LIVE_CLASSES = [
  {
    id: "live-1",
    title: "Advanced JavaScript Concepts",
    course: "Introduction to Web Development",
    tutor: "Dr. Sarah Johnson",
    date: "2023-11-25T15:00:00Z",
    duration: 60, // minutes
    status: "upcoming",
    attendees: 32,
    thumbnail: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg",
  },
  {
    id: "live-2",
    title: "Statistical Analysis with Python",
    course: "Data Science Fundamentals",
    tutor: "Prof. Michael Chen",
    date: "2023-11-24T18:30:00Z",
    duration: 90, // minutes
    status: "upcoming",
    attendees: 28,
    thumbnail: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
  },
  {
    id: "live-3",
    title: "Leadership Strategies for Teams",
    course: "Business Management Essentials",
    tutor: "Dr. Emily Rodriguez",
    date: "2023-11-23T14:00:00Z",
    duration: 75, // minutes
    status: "completed",
    attendees: 45,
    recording: "https://example.com/recording/leadership-strategies",
    thumbnail: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg",
  },
  {
    id: "live-4",
    title: "Prototyping Workshop",
    course: "UX/UI Design Principles",
    tutor: "Alex Thompson",
    date: "2023-11-22T16:00:00Z",
    duration: 120, // minutes
    status: "completed",
    attendees: 38,
    recording: "https://example.com/recording/prototyping-workshop",
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
  },
];

export const DEMO_QUIZ = {
  id: "quiz-1",
  title: "HTML Basics Quiz",
  courseId: "course-1",
  chapterId: "ch-1",
  questions: [
    {
      id: "q1",
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language",
        "Hyper Technical Modern Language"
      ],
      correctAnswer: 0
    },
    {
      id: "q2",
      question: "Which HTML element is used to define the title of a document?",
      options: [
        "<header>",
        "<title>",
        "<heading>",
        "<h1>"
      ],
      correctAnswer: 1
    },
    {
      id: "q3",
      question: "Which HTML attribute is used to define inline styles?",
      options: [
        "class",
        "font",
        "style",
        "css"
      ],
      correctAnswer: 2
    },
    {
      id: "q4",
      question: "Which HTML element is used to create a hyperlink?",
      options: [
        "<link>",
        "<a>",
        "<href>",
        "<hyperlink>"
      ],
      correctAnswer: 1
    },
    {
      id: "q5",
      question: "Which character is used to indicate an end tag?",
      options: [
        "^",
        "*",
        "/",
        "<"
      ],
      correctAnswer: 2
    }
  ],
  timeLimit: 10, // minutes
  passingScore: 70 // percentage
};

export const DEMO_USERS = {
  admin: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@edusphere.com",
    password: "admin123",
    role: "admin",
    avatar: null
  },
  tutor: {
    id: "tutor-1",
    name: "Dr. Sarah Johnson",
    email: "tutor@edusphere.com",
    password: "tutor123",
    role: "tutor",
    avatar: null,
    expertise: ["Web Development", "JavaScript", "React"],
    bio: "Experienced web developer and educator with over 10 years of industry experience."
  },
  student: {
    id: "student-1",
    name: "Alex Student",
    email: "student@edusphere.com",
    password: "student123",
    role: "student",
    avatar: null,
    enrolledCourses: ["course-1", "course-2", "course-4"]
  }
};