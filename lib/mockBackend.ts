// This is a mock backend service to simulate database operations

export interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

export interface User {
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
  getVideos: (): Promise<Video[]> => Promise.resolve([...videos]),
  addVideo: (video: Omit<Video, 'id'>): Promise<Video> => {
    const newVideo = { ...video, id: videos.length + 1 };
    videos.push(newVideo);
    return Promise.resolve(newVideo);
  },
  updateVideo: (id: number, video: Partial<Video>): Promise<Video | undefined> => {
    const index = videos.findIndex(v => v.id === id);
    if (index !== -1) {
      videos[index] = { ...videos[index], ...video };
      return Promise.resolve(videos[index]);
    }
    return Promise.resolve(undefined);
  },
  deleteVideo: (id: number): Promise<void> => {
    const initialLength = videos.length;
    videos = videos.filter(v => v.id !== id);
    if (videos.length === initialLength) {
      return Promise.reject(new Error('Video not found'));
    }
    return Promise.resolve();
  },

  // Users
  getUsers: (): Promise<User[]> => Promise.resolve([...users]),
  addUser: (user: Omit<User, 'id'>): Promise<User> => {
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      return Promise.reject(new Error('User with this email already exists'));
    }
    const newUser = { ...user, id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1 };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: (id: number, user: Partial<User>): Promise<User | undefined> => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      // Check if email is unique when updating
      if (user.email) {
        const emailExists = users.some(u => u.email === user.email && u.id !== id);
        if (emailExists) {
          return Promise.reject(new Error('Email already in use'));
        }
      }
      
      users[index] = { ...users[index], ...user };
      return Promise.resolve(users[index]);
    }
    return Promise.resolve(undefined);
  },
  deleteUser: (id: number): Promise<void> => {
    const initialLength = users.length;
    users = users.filter(u => u.id !== id);
    if (users.length === initialLength) {
      return Promise.reject(new Error('User not found'));
    }
    return Promise.resolve();
  },

  // Comments
  getComments: (): Promise<Comment[]> => Promise.resolve([...comments]),
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    const newComment = { 
      ...comment, 
      id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1, 
      createdAt: new Date().toISOString() 
    };
    comments.push(newComment);
    return Promise.resolve(newComment);
  },
  deleteComment: (id: number): Promise<void> => {
    const initialLength = comments.length;
    comments = comments.filter(c => c.id !== id);
    if (comments.length === initialLength) {
      return Promise.reject(new Error('Comment not found'));
    }
    return Promise.resolve();
  },

  // Analytics
  getAnalyticsData: (): Promise<AnalyticsData[]> => Promise.resolve([...analyticsData]),
};
