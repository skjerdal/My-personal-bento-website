type CardPosition = {
  span: number;
};

type CustomStyle = {
  cssVariables?: Record<string, string>;
  cssClasses?: string[];
  customCSS?: string;
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
    id: 'about',
    title: 'Thomas Skjerdal',
    content: 'A passionate full-stack developer with a love for creating interactive and engaging web experiences.',
    component: 'PokemonCard',
    position: { span: 1 },
    isUnique: true
  },
  {
    id: 'work',
    title: 'Work Experience',
    content: 'My professional journey as a developer',
    component: 'WorkExperience',
    position: { span: 2 },
    data: [
      {
        company: 'Tech Innovators',
        title: 'Senior Frontend Developer',
        period: 'Jan 2021 - Present',
        description: 'Leading the frontend development team in creating responsive and accessible web applications. Implemented modern UI/UX patterns and improved performance by 40%.'
      },
      {
        company: 'Digital Solutions Inc.',
        title: 'Full-Stack Developer',
        period: 'Mar 2019 - Dec 2020',
        description: 'Developed and maintained web applications using Vue.js, Node.js, and MongoDB. Led the migration from legacy systems to modern frameworks.'
      },
      {
        company: 'StartUp Studios',
        title: 'Junior Developer',
        period: 'Jun 2017 - Feb 2019',
        description: 'Assisted in the development of mobile apps using React Native and Firebase. Implemented key features that increased user engagement by 25%.'
      },
      {
        company: 'TechLabs',
        title: 'Intern',
        period: 'Jan 2017 - May 2017',
        description: 'Gained hands-on experience in web development technologies and contributed to small-scale projects. Learned agile methodologies and version control.'
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact',
    content: 'Connect with me on social media or send me an email.',
    component: 'ContactSocial',
    position: { span: 1 },
    data: {
      email: 'thomas@skjerdal.com',
      availability: {
        status: 'available', // can be 'available', 'busy', or 'away'
        message: 'Available for opportunities'
      },
      social: [
        {
          name: 'LinkedIn',
          url: 'https://linkedin.com/in/thomas-skjerdal-8ba458283',
          icon: 'linkedin'
        },
        {
          name: 'GitHub',
          url: 'https://github.com/skjerdal',
          icon: 'github'
        }
      ]
    },
    customStyle: {
      cssVariables: {
        '--card-bg': '#000000', // Solid black background
        '--text-primary': '#ffffff', // White text for contrast
        '--box-shadow': '0 20px 68px #00000040, 0 1px 2px #0000004d, 0 0 #000, inset 0 2px 1px #ffffff80, inset 1px 1px .25px #ffffff4d', // Complete shadow effect
        '--card-border': '1px solid #000', // Black border
        '--backdrop-filter': 'none' // Remove blur that might interfere
      }
    }
  },
  {
    id: 'education',
    title: 'Education',
    content: 'My academic background and achievements',
    component: 'Education',
    position: { span: 2 },
    videoPath: '/videos/education-loop.mp4',
    data: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        period: '2018 - 2020',
        achievements: [
          'Specialized in Artificial Intelligence and Machine Learning',
          'Thesis: "Deep Learning Approaches for Natural Language Processing"',
          'GPA: 3.9/4.0'
        ]
      },
      {
        degree: 'Bachelor of Science in Computer Engineering',
        institution: 'Massachusetts Institute of Technology',
        period: '2014 - 2018',
        achievements: [
          'Minor in Data Science',
          'Capstone Project: Developed a predictive maintenance system for IoT devices',
          'Dean\'s List for all semesters'
        ]
      },
      {
        degree: 'High School Diploma',
        institution: 'Thomas Jefferson High School for Science and Technology',
        period: '2010 - 2014',
        achievements: [
          'Valedictorian',
          'President of the Computer Science Club',
          'First place in State Mathematics Olympiad'
        ]
      }
    ]
  },
  {
    id: 'status',
    title: 'Current Status',
    content: 'What you are currently working on or learning...',
    component: 'CurrentStatus',
    position: { span: 1 },
    customStyle: {
      cssVariables: {
        '--card-bg': '#0813ff',
        '--text-primary': '#ffffff',
        '--box-shadow': '0 20px 68px #00000040, 0 1px 2px #0000004d, 0 0 #000, inset 1px 1px .2px #ffffff9e',
        '--card-border': '1px solid #0813ff',
        '--backdrop-filter': 'none'
      }
    }
  },
  {
    id: 'other',
    title: 'Other Large Card',
    content: 'Content for the third large card...',
    component: 'OtherLarge',
    position: { span: 1 }
  },
  {
    id: 'resume',
    title: 'Download Resume',
    content: 'Link to download your resume...',
    component: 'DownloadResume',
    position: { span: 1 }
  },
  {
    id: 'extra',
    title: 'Extra Card',
    content: 'Content for the extra small card...',
    component: 'ExtraCard',
    position: { span: 3 }
  }
];