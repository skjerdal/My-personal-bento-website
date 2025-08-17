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
    content: 'My professional journey in development and IT',
    component: 'WorkExperience',
    position: { span: 2 },
    data: [
      {
        company: 'Omega 365 Solutions',
        title: 'Developer (Part-time)',
        period: 'Sep 2024 - Present',
        description: 'Developing and maintaining web applications using Vue.js, SQL, and company frameworks. Supporting ongoing projects as part of an agile team.'
      },
      {
        company: 'Omega 365 Solutions',
        title: 'Summer Intern',
        period: 'Jun 2024 - Aug 2024',
        description: 'Completed 6-week training in SQL and developed a fully functional web application. Built features with SQL, Vue.js, and JavaScript.'
      },
      {
        company: "Norway's Best",
        title: 'IT Technician (Apprentice & Seasonal Work)',
        period: 'Aug 2019 - Aug 2023',
        description: 'Maintained IT infrastructure including payment systems, hotel systems, networks, servers. Provided technical support and troubleshooting across multiple locations.'
      },
      {
        company: 'Studvest',
        title: 'Voluntary Web Developer',
        period: 'Jan 2023 - Jun 2023',
        description: 'Developed interactive web-based articles for the student newspaper.'
      },
      {
        company: 'Skjerdal landskapspleie',
        title: 'Seasonal Gardener',
        period: 'Summers 2016 - 2018',
        description: 'Performed general maintenance tasks including grass cutting, street sweeping, and trash collection.'
      }
    ]
  },
  {
    id: 'contact',
    title: '',
    content: 'Connect with me on social media or send me an email.',
    component: 'ContactSocial',
    position: { span: 1 },
    data: {
      email: 'thomas@skjerdal.me',
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
        '--text-secondary': '#ffffff', // White text for secondary elements
        '--text-tertiary': '#ffffff', // White text for tertiary elements
        '--text-color': '#ffffff', // White text for card title
        '--box-shadow': '0 20px 68px #00000040, 0 1px 2px #0000004d, 0 0 #000, inset 0 2px 1px #ffffff80, inset 1px 1px .25px #ffffff4d', // Complete shadow effect
        '--card-border': '1px solid #000', // Black border
        '--backdrop-filter': 'none' // Remove blur that might interfere
      }
    }
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
        degree: 'Master, Datateknologi – Kunstig intelligens (AI)',
        institution: 'Norges teknisk-naturvitenskapelige universitet (NTNU)',
        period: '2025 - Present',
        logo: '/ntnu.png',
        achievements: [
          'Currently studying Datateknologi (Computer Science) with specialization in Artificial Intelligence at NTNU.',
          'Focus areas include machine learning, deep learning, data science, and intelligent systems.'
        ]
      },
      {
        degree: 'Master of Science in Computer Science, Artificial Intelligence',
        institution: 'Norwegian University of Science and Technology (NTNU)',
        location: 'Trondheim, Norway',
        period: 'Aug 2025 - Jun 2027 (expected)',
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
        achievements: [
          'Comprehensive training in computer electronics and IT systems',
          'Practical apprenticeship experience in real-world IT environments',
          'Foundation in hardware and software systems integration'
        ]
      }
    ]
  },
  {
    id: 'status',
    title: '',
    content: 'What you are currently working on or learning...',
    component: 'CurrentStatus',
    position: { span: 1 },
    customStyle: {
      cssVariables: {
        '--card-bg': 'url("/wavy.png"), #0813ff',
        '--text-primary': '#ffffff',
        '--text-color': '#ffffff',
        '--box-shadow': '0 20px 68px #00000040, 0 1px 2px #0000004d, 0 0 #000, inset 1px 1px .2px #ffffff9e',
        '--card-border': '1px solid #0813ff',
        '--backdrop-filter': 'none'
      }
    }
  },
  {
    id: 'resume',
    title: '',
    content: 'Link to download your resume...',
    component: 'DownloadResume',
    position: { span: 1 },
    data: {
      resumeUrl: '/resume.pdf',
      downloadName: 'Thomas_Skjerdal_Resume.pdf'
    }
  },
];