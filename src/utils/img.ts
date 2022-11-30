export const getImgUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return import.meta.env.VITE_IMG_HOST + url
}

export const getCoverUrl = (titleId: string, size: number, format: string) => {
  if (!titleId) return ''
  const apiUrl = import.meta.env.VITE_API_URL.endsWith('/')
    ? import.meta.env.VITE_API_URL.slice(0, -1)
    : import.meta.env.VITE_API_URL
  return apiUrl + `/titles/${titleId}/cover_${size}.${format}`
}
