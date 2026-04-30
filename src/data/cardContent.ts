type CardPosition = {
  span: number;
};

type CustomStyle = {
  cssVariables?: Record<string, string>;
  cssClasses?: string[];
};

type Card = {
  id: string;
  title: string;
  content: string;
  component: string;
  position: CardPosition;
  isUnique?: boolean;
  data?: any; // Add this line to include data property
  videoPath?: string; // Path to the video file for hover animation
  customStyle?: CustomStyle; // Add custom styling capability
};

export const cards: Card[] = [
  {
    id: 'about-me',
    title: '',
    content: "I'm from a small town, I like fishing, and I get most of my project ideas at times when I should definitely be asleep.",
    component: 'AboutMe',
    position: { span: 2 },
    customStyle: {
      cssClasses: ['about-me-card'],
      cssVariables: {
        '--text-primary': '#162033',
        '--text-secondary': '#3963ff',
        '--text-tertiary': '#66758c',
        '--text-color': '#162033',
        '--card-bg': 'linear-gradient(155deg, #f8f3ea 0%, #f9fbff 58%, #eef4ff 100%)',
        '--box-shadow': '0 20px 44px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
        '--card-border': '1px solid rgba(255, 255, 255, 0.82)',
        '--backdrop-filter': 'blur(10px)',
      }
    }
  },
  {
    id: 'booster-pack',
    title: '',
    content: '',
    component: 'BoosterPackCard',
    position: { span: 1 },
    isUnique: true,
  },
  {
    id: 'projects',
    title: '',
    content: '',
    component: 'Projects',
    position: { span: 2 },
    customStyle: {
      cssVariables: {
        '--card-bg': 'linear-gradient(155deg, #f8f3ea 0%, #f9fbff 58%, #eef4ff 100%)',
        '--box-shadow': '0 20px 44px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
        '--card-border': '1px solid rgba(255, 255, 255, 0.82)',
        '--backdrop-filter': 'blur(10px)',
      }
    }
  },
  {
    id: 'work',
    title: 'Work Experience',
    content: 'My professional journey in development and IT',
    component: 'WorkExperience',
    position: { span: 2 },
    data: [
      {
        company: 'Omega 365 Solutions',
        title: 'Developer (Part-time)',
        period: 'Sep 2024 - Present',
        logo: '/Omega365_Icon_Primary_RGB.png',
        highlights: [
          'Develop and maintain features for a SaaS platform used by enterprise clients, primarily within the BIM module.',
          'Build functionality with Vue.js, TypeScript, and SQL for complex data structures and interactive user interfaces.',
          'Contribute to production systems used by real customers with a focus on reliability, usability, and team collaboration.'
        ]
      },
      {
        company: 'Omega 365 Solutions',
        title: 'Summer Intern',
        period: 'Jun 2024 - Aug 2024',
        logo: '/Omega365_Icon_Primary_RGB.png',
        highlights: [
          'Completed an intensive SQL training program focused on database design and querying.',
          'Designed and developed a web application using Vue.js and JavaScript.',
          'Applied structured data handling and user-facing functionality in a practical development setting.'
        ]
      },
      {
        company: "Norway's Best",
        title: 'IT Technician (Apprentice & Seasonal Work)',
        period: 'Aug 2019 - Aug 2023',
        logo: '/norways best.jpg',
        highlights: [
          'Maintained and supported critical IT infrastructure across multiple locations.',
          'Worked with payment systems, hotel management systems, networks, and servers.',
          'Diagnosed and resolved technical issues to minimize downtime for staff and customers.'
        ]
      },
      {
        company: 'Skjerdal landskapspleie',
        title: 'Seasonal Gardener',
        period: 'Summers 2016 - 2018',
        highlights: [
          'Performed landscaping, street cleaning, and waste management tasks.',
          'Helped maintain safe, tidy, and well-kept outdoor environments.',
          'Built reliability and work discipline through seasonal hands-on work.'
        ]
      }
    ]
  },
  {
    id: 'activities',
    title: 'Activities',
    content: 'Things I have done outside of formal work and education',
    component: 'Activities',
    position: { span: 1 },
    data: [
      {
        organization: 'Hogskulen pa Vestlandet (HVL)',
        title: 'Teaching Assistant',
        period: 'Jul 2024 - Des 2024',
        logo: '/hvl-logo-vert-rgb.png',
        highlights: [
          'Teaching assistant for DAT108 Programming and Web Applications.',
          'Guided students in Java streams, functional programming, and core web development concepts.',
          'Provided assignment feedback and hands-on support with debugging, HTTP fundamentals, and problem solving.'
        ]
      },
      {
        organization: 'Hogskulen pa Vestlandet (HVL)',
        title: 'Teaching Assistant',
        period: 'Jan 2024 - Jul 2024',
        logo: '/hvl-logo-vert-rgb.png',
        highlights: [
          'Teaching assistant for DAT107 Databases.',
          'Supported students with SQL, ER modeling, and database design concepts.',
          'Evaluated assignments and helped students build structured and efficient data solutions.'
        ]
      },
      {
        organization: 'Studvest',
        title: 'Web Developer',
        period: 'Jan 2023 - Jun 2023',
        logo: '/studvestlogo.jpg',
        highlights: [
          'Developed interactive web-based articles for a student newspaper.',
          'Built dynamic storytelling and scrollytelling elements to improve reader engagement.',
          'Improved how users interacted with long-form content and digital editorial experiences.'
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    content: 'My academic journey in computer science and engineering',
    component: 'Education',
    position: { span: 2 },
    videoPath: '/videos/education-loop.mp4',
    data: [
      {
        degree: 'Master of Science in Computer Science, Artificial Intelligence',
        institution: 'Norwegian University of Science and Technology (NTNU)',
        location: 'Trondheim, Norway',
        period: 'Aug 2025 - Jun 2027 (expected)',
        logo: '/ntnu.png',
        achievements: [
          'Specializing in Artificial Intelligence',
          'Advanced studies in machine learning and AI systems',
          'Research-focused program at Norway\'s leading technical university'
        ]
      },
      {
        degree: 'Bachelor of Engineering, Computer Engineering',
        institution: 'Western Norway University of Applied Sciences (HVL)',
        location: 'Bergen, Norway',
        period: 'Aug 2022 - Jun 2025',
        logo: '/hvl-logo-vert-rgb.png',
        achievements: [
          'Thesis: "Videreutvikling og analyse av B Connected – En digital samhandlingsplattform"',
          'Focus on software development and system architecture',
          'Hands-on experience with modern programming languages and frameworks'
        ]
      },
      {
        degree: 'Trade School, Computer Electronics (3 years) + Apprenticeship (1.5 years)',
        institution: 'Sogndal Upper Secondary School',
        location: 'Sogndal, Norway',
        period: 'Aug 2016 - Mar 2021',
        logo: 'vestland_fylkeskommune.png',
        achievements: [
          'Comprehensive training in computer electronics and IT systems',
          'Practical apprenticeship experience in real-world IT environments',
          'Foundation in hardware and software systems integration'
        ]
      }
    ]
  },
];
