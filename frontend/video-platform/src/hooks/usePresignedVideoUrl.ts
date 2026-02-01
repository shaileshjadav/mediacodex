import { useEffect, useState } from 'react';
import { getVideoPresignedUrl } from '../apis/video';

export function usePresignedVideoUrl(videoId?: string, quality?: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoId || !quality) return;

    let cancelled = false;

    const fetchUrl = async () => {
      setLoading(true);
      const res = await getVideoPresignedUrl(videoId, quality);
      if (!cancelled) {
        setUrl(res.url);
        setLoading(false);
      }
    };

    fetchUrl();

    return () => {
      cancelled = true;
    };
  }, [videoId, quality]);

  return { url, loading };
}
