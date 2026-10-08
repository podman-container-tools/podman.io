import { useState, useEffect } from 'react';

interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  author_info: {
    author_link: string;
    display_name: string;
  };
  date?: string;
  wbDate?: string;
  jetpack_featured_media_url: string;
  link: string;
  excerpt: {
    rendered: string;
  };
}

interface UseBlogPostsReturn {
  data: BlogPost[];
  loading: boolean;
}

export const useBlogPosts = (limit = 4): UseBlogPostsReturn => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await fetch(
          `https://blog.podman.io/wp-json/wp/v2/posts?per_page=${limit}&_fields=id,author_info,title,wbDate,date,jetpack_featured_media_url,link,excerpt`,
        );
        const jsonData = await rawData.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return { data, loading };
};
