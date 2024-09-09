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
};

export const cards: Card[] = [
  {
    id: 'about',
    title: 'Thomas Skjerdal',
    content: 'A brief introduction about yourself...',
    component: 'PokemonCard',
    position: { span: 1 },
    isUnique: true
  },
  {
    id: 'work',
    title: 'Work Experience',
    content: 'Detail your work history here...',
    component: 'WorkExperience',
    position: { span: 2 }
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
    position: { span: 2 }
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