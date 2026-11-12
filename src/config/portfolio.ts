export interface ExperienceItem {
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  link: string;
  badge?: string;
  video?: string;
}

export interface TechStackItem {
  name: string;
  icon: string;
  url: string;
}

export interface PortfolioConfig {
  developer: {
    initials: string;
    brandName: string;
    name: string;
    fullName: string;
    title: string;
    heroRoles: [string, string, string, string];
    marqueeRoles: string[];
    description: string;
    languages: string[];
    interests: string[];
  };
  education: {
    institution: string;
    degree: string;
    period: string;
    location: string;
    coursework: string;
  };
  honors: string[];
  media: {
    characterModelUrl?: string;
    hdrEnvironmentUrl?: string;
    avatarImage: string;
    techStackVideoUrl?: string;
    resumePdfUrl?: string;
  };
  social: {
    githubHandle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  about: {
    title: string;
    description: string;
  };
  skills: {
    develop: {
      title: string;
      description: string;
      details: string;
      tools: string[];
    };
    design: {
      title: string;
      description: string;
      details: string;
      tools: string[];
    };
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  techStack: TechStackItem[][];
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  play: {
    opponentName: string;
    opponentRating: string;
    welcomeMessage: string;
    searchDepth: number;
  };
}

export const portfolioConfig: PortfolioConfig = {
  developer: {
    initials: "TH",
    brandName: "TejasHiran",
    name: "Tejas",
    fullName: "Tejas Hiran",
    title: "Electronics Engineer | Backend, Full-Stack & Applied AI Developer",
    heroRoles: [
      "Embedded & IoT",
      "Applied AI",
      "Full-Stack Developer",
      "Backend Developer",
    ],
    marqueeRoles: [
      "Electronics Engineer",
      "Backend & APIs",
      "Full Stack Developer",
      "Applied AI",
    ],
    description:
      "Primarily an Electronics & Telecommunication Engineer (AI minor, expected 2028) based in Pune, also building complete backend systems, web and Android apps, and applied AI tools.",
    languages: [
      "English (fluent)",
      "Hindi (native)",
      "Marathi (native)",
      "Japanese (conversational)",
    ],
    interests: [
      "electronics and embedded systems",
      "backend and full-stack apps",
      "applied AI and image models",
      "building startups",
      "GPS and map apps",
      "district-level badminton",
      "chess",
    ],
  },
  education: {
    institution: "AISSMS Institute of Information Technology",
    degree:
      "B.E. Electronics & Telecommunication Engineering (Minor in Artificial Intelligence)",
    period: "2024 - 2028",
    location: "Pune, India",
    coursework:
      "Microcontrollers & Embedded Systems, Digital Electronics, Data Structures, Verilog, PWM & Comparator Design",
  },
  honors: [
    "Patent application filed: Crop Disease Detection System (Indian Patents Act)",
    "District-level Badminton competitor",
  ],
  media: {
    characterModelUrl: "",
    hdrEnvironmentUrl: "",
    avatarImage: "/images/tejas-portrait.jpg",
    techStackVideoUrl: "",
    resumePdfUrl: "",
  },
  social: {
    githubHandle: "TheOnlyOne-07",
    email: "portfolio.tejashiran@gmail.com",
    phone: "",
    location: "Pune, India",
    website: "https://github.com/TheOnlyOne-07",
  },
  about: {
    title: "About Me",
    description:
      "I am primarily an Electronics & Telecommunication Engineer (AI minor, expected 2028) based in Pune, with hands-on experience in microcontrollers, Verilog, and sensor hardware. Alongside electronics, I build complete backend and web apps using Python, Node.js, Django, and React, and connect PyTorch and TensorFlow image models into live products. While studying, I co-founded two ventures and built projects from hardware and APIs all the way to live apps.",
  },
  skills: {
    develop: {
      title: "ELECTRONICS & AI",
      description: "Embedded hardware, backend APIs & applied AI",
      details:
        "I work with PIC18F microcontrollers, Verilog, MPU6050/HC-05 sensors, and circuit design, and build reliable APIs and databases with Python, Node.js, Django, PostgreSQL, Supabase, and SQLite alongside PyTorch and TensorFlow CNN models.",
      tools: [
        "PIC18F",
        "Verilog",
        "MPU6050 / HC-05",
        "Circuit Design",
        "Python",
        "Node.js",
        "Django",
        "PostgreSQL",
        "PyTorch",
        "TensorFlow",
      ],
    },
    design: {
      title: "FULL-STACK & OPS",
      description: "Web apps, mobile builds & cloud tools",
      details:
        "I create clean web and Android apps using React.js, Vite, Capacitor, Supabase, Leaflet, and h3-js, and deploy and automate workflows with AWS (EC2, S3), Firebase, Vercel, Android Studio, Playwright, and FFmpeg.",
      tools: [
        "React.js",
        "Vite",
        "TypeScript",
        "Capacitor",
        "Supabase",
        "Firebase",
        "AWS (EC2, S3)",
        "Vercel",
        "Playwright",
        "FFmpeg",
      ],
    },
  },
  experiences: [
    {
      position: "Co-Founder",
      company: "Vayu Run Club",
      period: "Jun 2026 - Present",
      location: "Kharadi, Pune, India",
      description:
        "Built the club from the ground up, leading content, brand growth, and partnerships with Decathlon, Bangalore Canteen, and Third Wave Coffee.",
      responsibilities: [
        "Led content planning, brand growth, and local business outreach",
        "Partnered with Decathlon, Bangalore Canteen, and Third Wave Coffee",
        "Created posts across Instagram, Reddit, and WhatsApp and pitched Nyati Plaza Mall, Cafe Rova, and Desi Chhora",
        "Turned an animated HTML poster into an Instagram promo video using Playwright and FFmpeg",
      ],
      technologies: [
        "Brand Growth",
        "Playwright",
        "FFmpeg",
        "Partnerships",
      ],
    },
    {
      position: "Project Intern",
      company: "IEEE",
      period: "Jun 2026",
      location: "Pune, India",
      description:
        "Built web app features using JavaScript, HTML, CSS, and Node.js as part of an engineering project team.",
      responsibilities: [
        "Built frontend and backend features using JavaScript, HTML, CSS, and Node.js",
        "Worked closely with the internship project team to ship updates on time",
      ],
      technologies: ["JavaScript", "Node.js", "HTML", "CSS"],
    },
    {
      position: "Secretary General",
      company: "Telecom Engineer's Student Association (TESA)",
      period: "Current",
      location: "AISSMS IOIT, Pune",
      description:
        "Lead the EnTC department student body, organizing technical events, team communication, and student activities.",
      responsibilities: [
        "Lead the student body for the EnTC department at AISSMS IOIT",
        "Organize events, team communication, and department programs",
      ],
      technologies: ["Leadership", "Event Operations", "EnTC"],
    },
    {
      position: "Co-Founder",
      company: "dotblackmedia (Video Editing Agency)",
      period: "Apr 2023 - Present",
      location: "Pune, India",
      description:
        "Managed video editing and 30-day content plans for clients, and set up domain and email systems for client outreach.",
      responsibilities: [
        "Delivered video edits and a 30-day Instagram content plan for a real estate page",
        "Set up domain, DNS, and email outreach systems using Google Workspace, Vercel DNS, and Instantly AI",
      ],
      technologies: [
        "Google Workspace",
        "Vercel DNS",
        "Instantly AI",
        "Content Strategy",
      ],
    },
    {
      position: "B.E. EnTC (AI Minor)",
      company: "AISSMS Institute of Information Technology",
      period: "2024 - 2028",
      location: "Pune, India",
      description:
        "Studying Electronics & Telecommunication Engineering with a minor in AI, covering embedded systems, microcontrollers, Verilog, and data structures.",
      responsibilities: [
        "Coursework in Microcontrollers, Embedded Systems, Verilog, PWM, and Digital Electronics",
        "Applied AI, Data Structures, and hardware-software integration projects",
      ],
      technologies: ["PyTorch", "PIC18F", "Verilog", "Data Structures"],
    },
  ],
  projects: [
    {
      id: 1,
      title: "Crop Disease Detection System",
      category: "AI, Web Platform & Hardware • Patent Filed",
      technologies:
        "PyTorch, TensorFlow, 39-Class CNN, React, Django, Google Maps API, Hardware Rover",
      image: "/images/project-crop.svg",
      badge: "PATENT FILED",
      description:
        "Patent-filed farming AI tool that detects 39 plant diseases using PyTorch and TensorFlow CNN models, connected to a camera rover, React/Django web app, and Google Maps API.",
      link: "https://github.com/TheOnlyOne-07",
    },
    {
      id: 2,
      title: "TERRA",
      category: "React, Vite, Capacitor, Firebase",
      technologies:
        "React, Vite, Capacitor, Firebase, Leaflet, h3-js, PRD/TRD & Security Plan",
      image: "/images/project-terra.svg",
      description:
        "A GPS-based hex territory capture Android game built with React, Vite, Capacitor, Firebase, Leaflet, and h3-js, along with complete product, technical, and security docs.",
      link: "https://github.com/TheOnlyOne-07",
    },
    {
      id: 3,
      title: "Automated Cold Outreach System",
      category: "Node.js & Python Pipeline",
      technologies:
        "Node.js, Python, Apollo.io Scraper, SQLite, Nodemailer, IMAP, node-cron",
      image: "/images/project-outreach.svg",
      description:
        "An automated cold-email system with an Apollo.io scraper, SQLite database, Nodemailer, IMAP reply tracking, node-cron scheduling, and Python scripts to clean 5,000+ contacts.",
      link: "https://github.com/TheOnlyOne-07",
    },
    {
      id: 4,
      title: "Ration Distribution Auth System",
      category: "Android & Supabase",
      technologies:
        "Android, Supabase, Aadhaar / OTP Login, Simple Accessible UI",
      image: "/images/project-ration.svg",
      description:
        "A secure Android app for public ration distribution with a clear, easy-to-use design and Aadhaar/OTP sign-in backed by Supabase.",
      link: "https://github.com/TheOnlyOne-07",
    },
    {
      id: 5,
      title: "Tejas AI & Chess Arena",
      category: "Interactive Engine / Web",
      technologies:
        "TypeScript, Web Workers, Alpha-Beta Search, Chess.js, Express API",
      image: "/images/project-chess.svg",
      description:
        "An interactive chess game powered by a fast Web Worker engine, paired with a live chat assistant that answers questions about my work.",
      link: "/play",
    },
  ],
  techStack: [
    [
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        url: "https://python.org",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        url: "https://typescriptlang.org",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        url: "https://nodejs.org",
      },
      {
        name: "Django",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
        url: "https://djangoproject.com",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        url: "https://react.dev",
      },
      {
        name: "Vite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
        url: "https://vite.dev",
      },
      {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      },
      {
        name: "PyTorch",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        url: "https://pytorch.org",
      },
    ],
    [
      {
        name: "TensorFlow",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
        url: "https://tensorflow.org",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        url: "https://postgresql.org",
      },
      {
        name: "Supabase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
        url: "https://supabase.com",
      },
      {
        name: "SQLite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
        url: "https://sqlite.org",
      },
      {
        name: "Firebase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        url: "https://firebase.google.com",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        url: "https://aws.amazon.com",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
        url: "https://vercel.com",
      },
      {
        name: "Android",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
        url: "https://developer.android.com/studio",
      },
    ],
    [
      {
        name: "Capacitor",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/capacitor/capacitor-original.svg",
        url: "https://capacitorjs.com",
      },
      {
        name: "Playwright",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg",
        url: "https://playwright.dev",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        url: "https://git-scm.com",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        url: "https://github.com/TheOnlyOne-07",
      },
      {
        name: "Three.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
        url: "https://threejs.org",
      },
      {
        name: "Linux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
        url: "https://linux.org",
      },
    ],
    [
      {
        name: "C",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
        url: "https://en.cppreference.com/w/c",
      },
      {
        name: "C++",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        url: "https://isocpp.org",
      },
      {
        name: "VS Code",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
        url: "https://code.visualstudio.com",
      },
      {
        name: "Google Cloud",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
        url: "https://mapsplatform.google.com",
      },
    ],
  ],
  contact: {
    email: "portfolio.tejashiran@gmail.com",
    phone: "",
    github: "https://github.com/TheOnlyOne-07",
    linkedin: "https://linkedin.com/in/tejas-hiran-b198b82b8",
    twitter: "",
    facebook: "",
    instagram: "https://www.instagram.com/ttejass_7/",
  },
  play: {
    opponentName: "Tejas Hiran",
    opponentRating: "~2100",
    welcomeMessage:
      "Hey! I am Tejas Hiran 👋 Ask me about my patent-filed Crop Disease Detection System, TERRA, my startups, or make your first move on the board!",
    searchDepth: 4,
  },
};
