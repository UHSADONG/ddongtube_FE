import { useEffect, useState, useCallback } from 'react'
import {
  checkYoutubeVideoExists,
  extractYoutubeVideoId,
  validateYoutubeUrlFormat,
} from '@/utils/youtube'

type YoutubeValidationResult = {
  isValid: boolean
  videoId: string | null
  reason?: string
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useYoutubeState = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [result, setResult] = useState<YoutubeValidationResult>({
    isValid: false,
    videoId: null,
    reason: '',
  })

  const debouncedUrl = useDebounce(youtubeUrl, 500);

  const resetYoutubeUrl = useCallback(() => {
    setYoutubeUrl('')
    setResult({ isValid: false, videoId: null, reason: '' })
    setVideoDescription('')
  }, []);

  const handleYoutubeUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setYoutubeUrl(e.target.value);
  }, []);

  const handleVideoDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVideoDescription(e.target.value);
  }, []);

  const validateYoutube = useCallback(async (url: string): Promise<YoutubeValidationResult> => {
    const trimmed = url.trim()

    if (!trimmed) {
      return { isValid: false, videoId: null, reason: 'URL이 비어있습니다.' }
    }

    if (!validateYoutubeUrlFormat(trimmed)) {
      return { isValid: false, videoId: null, reason: '유효한 유튜브 URL 형식이 아닙니다.' }
    }

    const exists = await checkYoutubeVideoExists(trimmed)
    if (!exists) {
      return { isValid: false, videoId: null, reason: '존재하지 않는 유튜브 영상입니다.' }
    }

    const id = extractYoutubeVideoId(trimmed)
    return { isValid: true, videoId: id }
  }, [])

  useEffect(() => {
    const check = async () => {
      const trimmed = debouncedUrl.trim();

      if (trimmed === '') {
        if (result.isValid || result.videoId || result.reason) {
          setResult({ isValid: false, videoId: null, reason: '' });
        }
        return;
      }

      const res = await validateYoutube(trimmed);
      if (res.isValid === result.isValid && res.videoId === result.videoId && res.reason === result.reason) {
        return;
      }
      setResult(res);
    };

    check();
  }, [debouncedUrl, validateYoutube]);

  return {
    youtubeUrl,
    videoDescription,
    resetYoutubeUrl,
    handleYoutubeUrlChange,
    handleVideoDescriptionChange,
    ...result,
  }
}

export default useYoutubeState