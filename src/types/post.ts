
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
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    comments: Comment[];
  }

  export interface Comment {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
  }
  

export interface Category {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

