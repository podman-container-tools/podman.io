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
  wbDate: string;
  jetpack_featured_media_url: string;
  link: string;
  excerpt: {
    rendered: string;
  };
}

interface UseBlogPostsReturn {
  data: BlogPost[];
  loading: boolean;
  error: string | null;
}

export const useBlogPosts = (limit = 4): UseBlogPostsReturn => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await fetch(
          `https://blog.podman.io/wp-json/wp/v2/posts?per_page=${limit}&_fields=id,author_info,title,wbDate,jetpack_featured_media_url,link,excerpt`,
        );
        if (!rawData.ok) {
          throw new Error(`HTTP error! status: ${rawData.status}`);
        }
        const jsonData = await rawData.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  return { data, loading, error };
};
