interface Photo {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Video {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Wedding {
  id: string;
  title: string;
  createdBy: string;
  photos: Photo[];
  videos: Video[];
}

let weddings: Wedding[] = [
  {
    id: '1',
    title: 'Sarah & John\'s Wedding',
    createdBy: 'Wedding Planner',
    photos: [
      { id: '1', url: '/wedding1-photo1.jpg', uploadedBy: 'Guest1', uploadedAt: '2023-06-20T10:00:00Z' },
      { id: '2', url: '/wedding1-photo2.jpg', uploadedBy: 'Guest2', uploadedAt: '2023-06-20T11:30:00Z' },
    ],
    videos: [
      { id: '1', url: '/wedding1-video1.mp4', uploadedBy: 'Guest3', uploadedAt: '2023-06-20T12:45:00Z' },
    ],
  },
  {
    id: '2',
    title: 'Emily & Michael\'s Wedding',
    createdBy: 'Bride\'s Sister',
    photos: [
      { id: '3', url: '/wedding2-photo1.jpg', uploadedBy: 'Guest4', uploadedAt: '2023-06-21T09:15:00Z' },
    ],
    videos: [],
  },
];

export const mockLiveWeddingsBackend = {
  getWeddings: () => Promise.resolve(weddings),
  
  getWedding: (id: string) => Promise.resolve(weddings.find(w => w.id === id)),
  
  addWedding: (title: string, createdBy: string) => {
    const newWedding: Wedding = {
      id: (weddings.length + 1).toString(),
      title,
      createdBy,
      photos: [],
      videos: [],
    };
    weddings.push(newWedding);
    return Promise.resolve(newWedding);
  },
  
  addPhoto: (weddingId: string, photo: Omit<Photo, 'id'>) => {
    const wedding = weddings.find(w => w.id === weddingId);
    if (wedding) {
      const newPhoto = { ...photo, id: (wedding.photos.length + 1).toString() };
      wedding.photos.push(newPhoto);
      return Promise.resolve(newPhoto);
    }
    return Promise.reject(new Error('Wedding not found'));
  },
  
  addVideo: (weddingId: string, video: Omit<Video, 'id'>) => {
    const wedding = weddings.find(w => w.id === weddingId);
    if (wedding) {
      const newVideo = { ...video, id: (wedding.videos.length + 1).toString() };
      wedding.videos.push(newVideo);
      return Promise.resolve(newVideo);
    }
    return Promise.reject(new Error('Wedding not found'));
  },
};

