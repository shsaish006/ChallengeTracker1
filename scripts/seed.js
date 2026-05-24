import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockTypes = [
  { name: 'Code', description: 'Software engineering, API development, and system design.' },
  { name: 'Design', description: 'UI/UX design, wireframing, and vector layouts.' },
  { name: 'Data Science', description: 'Predictive modeling, machine learning, and stats.' },
  { name: 'QA', description: 'Quality assurance, test writing, and bug hunting.' }
];

const mockTracks = [
  { name: 'Development', description: 'Full-stack, backend, mobile, or cloud engineering.' },
  { name: 'Design', description: 'Creative styling, user experience, and mockups.' },
  { name: 'Data Science', description: 'Neural networks, datasets, and analysis.' },
  { name: 'QA', description: 'Testing, automation, and coverage check.' }
];

const mockChallenges = [
  {
    name: 'Build Advanced Glassmorphic Dashboard',
    description: 'Implement a gorgeous reactive SPA dashboard with HSL palettes, smooth animations, and dual database ORM pipelines.',
    type: 'Code',
    track: 'Development',
    status: 'active',
    challengeSource: 'Work Manager',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    prizes: [
      { place: 1, value: 1500, currency: 'USD' },
      { place: 2, value: 750, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 48, status: 'Closed' },
      { name: 'Submission', duration: 120, status: 'Open' },
      { name: 'Review', duration: 24, status: 'Pending' }
    ],
    tags: ['React', 'TypeScript', 'Prisma', 'Drizzle', 'PostgreSQL', 'CSS3'],
    skills: [
      { name: 'Frontend React Development', level: 'Expert' },
      { name: 'Database Schemas', level: 'Intermediate' }
    ],
    groups: ['Global Developers']
  },
  {
    name: 'Neural Network Customer Prediction Model',
    description: 'Construct a predictive machine learning model in Python/TensorFlow to forecast user conversion metrics based on click logs.',
    type: 'Data Science',
    track: 'Data Science',
    status: 'active',
    challengeSource: 'Github',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    prizes: [
      { place: 1, value: 2000, currency: 'USD' },
      { place: 2, value: 1000, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 72, status: 'Open' },
      { name: 'Submission', duration: 168, status: 'Open' }
    ],
    tags: ['Python', 'TensorFlow', 'Data Science', 'Machine Learning'],
    skills: [
      { name: 'Deep Learning', level: 'Expert' },
      { name: 'Data Preprocessing', level: 'Expert' }
    ],
    groups: ['AI Labs']
  },
  {
    name: 'Sleek Dark Mobile Wallet Wireframes',
    description: 'Design comprehensive UI wireframes and user flow architectures for a secure mobile cryptocurrency wallet in Figma.',
    type: 'Design',
    track: 'Design',
    status: 'completed',
    challengeSource: 'Topgear',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    prizes: [
      { place: 1, value: 1200, currency: 'USD' },
      { place: 2, value: 600, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 24, status: 'Closed' },
      { name: 'Submission', duration: 72, status: 'Closed' },
      { name: 'Review', duration: 48, status: 'Closed' }
    ],
    tags: ['Figma', 'UI/UX', 'Mobile Design', 'Crypto'],
    skills: [
      { name: 'User Experience Mapping', level: 'Expert' },
      { name: 'Figma Vector Tools', level: 'Expert' }
    ],
    groups: ['Designers Guild']
  },
  {
    name: 'Write Automation Scripts for Drizzle Sandbox',
    description: 'Implement rigorous automated Cypress/Selenium scripts checking endpoint integrity of our multi-ORM Drizzle database layer.',
    type: 'QA',
    track: 'QA',
    status: 'draft',
    challengeSource: 'Manual Entry',
    createdBy: 'system',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    prizes: [
      { place: 1, value: 800, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 48, status: 'Pending' },
      { name: 'Submission', duration: 96, status: 'Pending' }
    ],
    tags: ['Cypress', 'QA', 'Integration Tests', 'Drizzle'],
    skills: [
      { name: 'Test Automation', level: 'Expert' },
      { name: 'Cypress', level: 'Intermediate' }
    ],
    groups: ['QA Alliance']
  },
  {
    name: 'Implement OAuth2 and Security Headers',
    description: 'Secure our Node Express API endpoints using JWT authentication, OAuth2 login pathways, and custom helmet protection policies.',
    type: 'Code',
    track: 'Development',
    status: 'active',
    challengeSource: 'Work Manager',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    prizes: [
      { place: 1, value: 1600, currency: 'USD' },
      { place: 2, value: 800, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 24, status: 'Closed' },
      { name: 'Submission', duration: 120, status: 'Open' }
    ],
    tags: ['Node.js', 'Express', 'JWT', 'Security', 'Auth'],
    skills: [
      { name: 'Backend Security Headers', level: 'Expert' },
      { name: 'JWT Encryption', level: 'Expert' }
    ],
    groups: ['Security Core']
  },
  {
    name: 'Figma Landing Page for E-Commerce',
    description: 'Design a highly engaging, converting, and responsive homepage design for a modern organic produce retailer.',
    type: 'Design',
    track: 'Design',
    status: 'active',
    challengeSource: 'Topgear',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    prizes: [
      { place: 1, value: 1000, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 24, status: 'Closed' },
      { name: 'Submission', duration: 96, status: 'Open' }
    ],
    tags: ['Figma', 'UI/UX', 'Web Layout', 'Responsive'],
    skills: [
      { name: 'Visual Branding', level: 'Expert' }
    ],
    groups: ['Creative Hub']
  },
  {
    name: 'Time-Series Analysis on Retail Inventory',
    description: 'Process warehouse data collections to discover ordering cycles and demand forecasts using ARIMA models in R.',
    type: 'Data Science',
    track: 'Data Science',
    status: 'completed',
    challengeSource: 'Github',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    prizes: [
      { place: 1, value: 2500, currency: 'USD' },
      { place: 2, value: 1200, currency: 'USD' }
    ],
    phases: [
      { name: 'Registration', duration: 48, status: 'Closed' },
      { name: 'Submission', duration: 168, status: 'Closed' },
      { name: 'Review', duration: 48, status: 'Closed' }
    ],
    tags: ['R', 'ARIMA', 'Inventory', 'Data Science'],
    skills: [
      { name: 'Time-Series Forecasting', level: 'Expert' }
    ],
    groups: ['AI Labs']
  },
  {
    name: 'Deploy Kubernetes Cluster on AWS',
    description: 'Configure clean YAML blueprints to deploy and auto-scale our React and Express systems inside secure EKS clusters.',
    type: 'Code',
    track: 'Development',
    status: 'cancelled',
    challengeSource: 'Manual Entry',
    createdBy: 'system',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    prizes: [
      { place: 1, value: 3000, currency: 'USD' }
    ],
    tags: ['Kubernetes', 'EKS', 'AWS', 'YAML', 'DevOps'],
    skills: [
      { name: 'Cloud Infrastructure Configuration', level: 'Expert' }
    ],
    groups: ['Global Developers']
  }
];

async function seed() {
  console.log('Clearing database tables...');
  await prisma.challenge.deleteMany({});
  await prisma.challengeType.deleteMany({});
  await prisma.challengeTrack.deleteMany({});

  console.log('Seeding challenge types...');
  for (const t of mockTypes) {
    await prisma.challengeType.create({ data: t });
  }

  console.log('Seeding challenge tracks...');
  for (const tr of mockTracks) {
    await prisma.challengeTrack.create({ data: tr });
  }

  console.log('Seeding detailed challenge records...');
  for (const c of mockChallenges) {
    await prisma.challenge.create({ data: c });
  }

  console.log('Successfully seeded database with highly detailed records!');
}

seed()
  .catch(err => {
    console.error('Migration seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
