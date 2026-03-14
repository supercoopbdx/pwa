import axios from 'axios'
import config from '@/config.ts'

const cache = new Map<string, string>()
const pending = new Map<string, Promise<string>>()

export function useImageCache() {
  async function fetchImage(path: string): Promise<string> {
    if (!path) return '/image-not-found-icon.svg'
    if (cache.has(path)) return cache.get(path)!

    if (pending.has(path)) return pending.get(path)!

    const promise = axios
      .get(`${config.backend.baseURL}${path}`, { responseType: 'blob' })
      .then((response) => {
        const url = URL.createObjectURL(response.data)
        cache.set(path, url)
        return url
      })
      .catch(() => {
        cache.set(path, '/image-not-found-icon.svg')
        return '/image-not-found-icon.svg'
      })
      .finally(() => pending.delete(path))

    pending.set(path, promise)
    return promise
  }

  function prefetch(path: string) {
    if (!path || cache.has(path) || pending.has(path)) return
    fetchImage(path)
  }

  return { fetchImage, prefetch }
}
