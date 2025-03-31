import React, { useEffect, useState } from 'react'
import {
  checkYoutubeVideoExists,
  extractYoutubeVideoId,
  validateYoutubeUrlFormat,
} from '../../utils/youtube'

type YoutubeValidationResult = {
  isValid: boolean
  videoId: string | null
  reason?: string
}

const useYoutubeState = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [result, setResult] = useState<YoutubeValidationResult>({
    isValid: false,
    videoId: null,
    reason: '',
  })

  const resetYoutubeUrl = () => {
    setYoutubeUrl('')
    setResult({ isValid: false, videoId: null, reason: '' })
  }

  const validateYoutube = async (url: string): Promise<YoutubeValidationResult> => {
    const trimmed = url.trim()

    if (!trimmed) {
      return { isValid: false, videoId: null, reason: 'URL이 비어있습니다.' }
    }

    const isFormatValid = validateYoutubeUrlFormat(trimmed)
    if (!isFormatValid) {
      return { isValid: false, videoId: null, reason: '유효한 유튜브 URL 형식이 아닙니다.' }
    }

    const exists = await checkYoutubeVideoExists(trimmed)
    if (!exists) {
      return { isValid: false, videoId: null, reason: '존재하지 않는 유튜브 영상입니다.' }
    }

    const id = extractYoutubeVideoId(trimmed)
    return { isValid: true, videoId: id }
  }

  useEffect(() => {
    const check = async () => {
      const validationResult = await validateYoutube(youtubeUrl)
      setResult(validationResult)
    }

    check()
  }, [youtubeUrl])

  return {
    youtubeUrl,
    setYoutubeUrl,
    resetYoutubeUrl,
    ...result, 
  }
}

export default useYoutubeState