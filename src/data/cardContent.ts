type CardPosition = {
  span: number;
};

type Card = {
  id: string;
  title: string;
  content: string;
  component: string;
  position: CardPosition;
  isUnique?: boolean;
  data?: any; // Add this line to include data property
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
    content: 'Detail your work history here...',
    component: 'WorkExperience',
    position: { span: 2 },
    data: [
      {
        company: 'Company A',
        title: '1',
        period: 'Jan 2020 - Present',
        description: 'Developed and maintained web applications using Vue.js and Node.js.'
      },
      {
        company: 'Company B',
        title: '2',
        period: 'Jun 2018 - Dec 2019',
        description: 'Assisted in the development of mobile apps using React Native and Firebase.'
      }
    ]
  },
  {
    id: 'contact',
    title: 'Contact & Social',
    content: 'Your contact information and social media links...',
    component: 'ContactSocial',
    position: { span: 1 }
  },
  {
    id: 'education',
    title: 'Education',
    content: 'List your educational background...',
    component: 'Education',
    position: { span: 2 },
    data: [
      {
        degree: '1',
        institution: 'Stanford University',
        period: '2018 - 2020',
        achievements: [
          'Specialized in Artificial Intelligence and Machine Learning',
          'Thesis: "Deep Learning Approaches for Natural Language Processing"',
          'GPA: 3.9/4.0'
        ]
      },
      {
        degree: '2',
        institution: 'Massachusetts Institute of Technology',
        period: '2014 - 2018',
        achievements: [
          'Minor in Data Science',
          'Capstone Project: Developed a predictive maintenance system for IoT devices',
          'Dean\'s List for all semesters'
        ]
      },
      {
        degree: '3',
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
    position: { span: 1 }
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