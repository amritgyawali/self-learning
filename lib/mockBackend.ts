// This is a mock backend service to simulate database operations

export interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  createdAt: string;
}

export interface AnalyticsData {
  date: string;
  visitors: number;
  pageViews: number;
}

let videos: Video[] = [
  { id: 1, title: 'Wedding Highlights', url: 'https://example.com/video1.mp4', thumbnail: '/video-thumbnail-1.jpg' },
  { id: 2, title: 'Beach Wedding', url: 'https://example.com/video2.mp4', thumbnail: '/video-thumbnail-2.jpg' },
];

let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor' },
];

let comments: Comment[] = [
  { id: 1, user: 'Alice', content: 'Beautiful photos!', createdAt: '2023-06-15T10:00:00Z' },
  { id: 2, user: 'Bob', content: 'Great work!', createdAt: '2023-06-16T14:30:00Z' },
];

let analyticsData: AnalyticsData[] = [
  { date: '2023-06-10', visitors: 100, pageViews: 300 },
  { date: '2023-06-11', visitors: 120, pageViews: 350 },
  { date: '2023-06-12', visitors: 90, pageViews: 280 },
  { date: '2023-06-13', visitors: 110, pageViews: 320 },
  { date: '2023-06-14', visitors: 130, pageViews: 400 },
];

export const mockBackend = {
  // Videos
  getVideos: () => Promise.resolve(videos),
  addVideo: (video: Omit<Video, 'id'>) => {
    const newVideo = { ...video, id: videos.length + 1 };
    videos.push(newVideo);
    return Promise.resolve(newVideo);
  },
  updateVideo: (id: number, video: Partial<Video>) => {
    videos = videos.map(v => v.id === id ? { ...v, ...video } : v);
    return Promise.resolve(videos.find(v => v.id === id));
  },
  deleteVideo: (id: number) => {
    videos = videos.filter(v => v.id !== id);
    return Promise.resolve();
  },

  // Users
  getUsers: () => Promise.resolve(users),
  addUser: (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: users.length + 1 };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (id: number, user: Partial<User>) => {
    users = users.map(u => u.id === id ? { ...u, ...user } : u);
    return Promise.resolve(users.find(u => u.id === id));
  },
  deleteUser: (id: number) => {
    users = users.filter(u => u.id !== id);
    return Promise.resolve();
  },

  // Comments
  getComments: () => Promise.resolve(comments),
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment = { ...comment, id: comments.length + 1, createdAt: new Date().toISOString() };
    comments.push(newComment);
    return Promise.resolve(newComment);
  },
  deleteComment: (id: number) => {
    comments = comments.filter(c => c.id !== id);
    return Promise.resolve();
  },

  // Analytics
  getAnalyticsData: () => Promise.resolve(analyticsData),
};

