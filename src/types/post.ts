
export interface Post {
    id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
    publishedAt: string;
    likes: number;
    comments: number;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  }
  