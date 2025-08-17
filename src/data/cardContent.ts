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
        company: 'Omega 365',
        title: 'Utvikler (Developer)',
        period: 'Sep 2024 - Present',
        description: 'Part-time developer role at Bergen-based software company, working with modern web technologies and software solutions.',
        logo: '/Omega365_Icon_Primary_RGB.png'
      },
      {
        company: 'Omega 365',
        title: 'Summer Internship',
        period: 'Jun 2024 - Aug 2024',
        description: '6 weeks of SQL training plus project work developing a complete web application using SQL, Vue.js, and related technologies.',
        logo: '/Omega365_Icon_Primary_RGB.png'
      },
      {
        company: 'Høgskulen på Vestlandet (HVL)',
        title: 'Studentassistent - DAT108',
        period: 'Jul 2024 - Dec 2024',
        description: 'Teaching assistant for Programming and Web Applications course. Grading assignments and helping students with Java streams, lambda expressions, functional programming, Java Spring MVC, JavaScript, and web development.',
        logo: '/hvl-logo-vert-rgb.png'
      },
      {
        company: 'Høgskulen på Vestlandet (HVL)',
        title: 'Studentassistent - DAT107',
        period: 'Jan 2024 - Jul 2024',
        description: 'Teaching assistant for Database course. Grading assignments and helping students with SQL, ERD, Java ORM, and document databases.',
        logo: '/hvl-logo-vert-rgb.png'
      },
      {
        company: 'Studvest',
        title: 'Webutvikler (Web Developer)',
        period: 'Jan 2023 - May 2023',
        description: 'Volunteer web developer creating modern and engaging news articles online for the student newspaper.',
        logo: '/studvestlogo.jpg'
      },
      {
        company: "Norway's Best",
        title: 'IT-medarbeider',
        period: 'Jun 2023 - Aug 2023',
        description: 'Summer job providing technical user support, IT operations, and system maintenance.',
        logo: '/norways best.jpg'
      },
      {
        company: "Norway's Best",
        title: 'Dataelektroniker',
        period: 'Aug 2019 - Mar 2021',
        description: 'Apprenticeship managing all IT-related operations including payment systems, hotel systems, networks, servers, and user support across multiple locations.',
        logo: '/norways best.jpg'
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
    content: 'My academic journey in computer engineering',
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
        degree: 'Bachelor, Dataingeniør (Computer Engineering)',
        institution: 'Høgskulen på Vestlandet (HVL)',
        period: '2022 - 2025',
        logo: '/hvl-logo-vert-rgb.png',
        achievements: [
          'Currently pursuing degree in Computer Engineering',
          'Focus on software development and system architecture',
          'Hands-on experience with modern programming languages and frameworks'
        ]
      },
      {
        degree: 'Ingeniør forkurs (Engineering Foundation Course)',
        institution: 'Høgskulen på Vestlandet (HVL)',
        period: '2021 - 2022',
        logo: '/hvl-logo-vert-rgb.png',
        achievements: [
          'One-year preparatory course for engineering education',
          'Mathematics, physics, and technical foundations',
          'Successfully qualified for Computer Engineering program'
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
    position: { span: 1 }
  },
];