import { addDays, subDays, startOfMonth, addHours } from 'date-fns';

export const currentUser = {
  id: 'u1',
  name: 'Dad',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dad',
};

export const circles = [
  { id: '1', name: 'Couple', level: 1, description: 'Just Mom & Dad' },
  { id: '2', name: 'Nuclear Family', level: 2, description: 'Mom, Dad & Kids' },
  { id: '3', name: 'Extended Family', level: 3, description: 'Grandparents, Aunts, Uncles' },
];

const today = new Date();

export const initialEvents = [
  {
    id: 'e1',
    title: 'Date Night',
    date: addDays(today, 2),
    circleId: '1', // Couple
    description: 'Dinner at Mario\'s',
  },
  {
    id: 'e2',
    title: 'Soccer Practice',
    date: addDays(today, 0),
    circleId: '2', // Nuclear
    description: 'Bring snacks',
  },
  {
    id: 'e3',
    title: 'Grandma\'s Birthday',
    date: addDays(today, 5),
    circleId: '3', // Extended
    description: 'Surprise party at the park',
  },
  {
    id: 'e4',
    title: 'Dentist Appointment',
    date: subDays(today, 3),
    circleId: '2', // Nuclear
    description: 'Checkup for everyone',
  },
];

export const initialPhotos = [
  {
    id: 'p1',
    url: 'https://picsum.photos/id/1011/800/600',
    date: addDays(today, 2),
    circleId: '1',
    caption: 'Beautiful sunset',
  },
  {
    id: 'p2',
    url: 'https://picsum.photos/id/1015/800/600',
    date: addDays(today, 0),
    circleId: '2',
    caption: 'Soccer game win!',
  },
  {
    id: 'p3',
    url: 'https://picsum.photos/id/1025/800/600',
    date: addDays(today, 5),
    circleId: '3',
    caption: 'Birthday cake',
  },
  {
    id: 'p4',
    url: 'https://picsum.photos/id/1025/800/600',
    date: subDays(today, 10),
    circleId: '3',
    caption: 'Throwback',
  }
];

export const initialMessages = [
  {
    id: 'm1',
    senderId: 'u1',
    text: 'Reservations are set for 7pm.',
    timestamp: subDays(today, 1),
    circleId: '1',
  },
  {
    id: 'm2',
    senderId: 'u2', // Mom
    text: 'Can you pick up milk on the way home?',
    timestamp: subDays(today, 0),
    circleId: '2',
  },
  {
    id: 'm3',
    senderId: 'u3', // Grandma
    text: 'Looking forward to seeing everyone!',
    timestamp: subDays(today, 2),
    circleId: '3',
  },
];
