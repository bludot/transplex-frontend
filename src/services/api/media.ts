import instance from './http'
import { IMedia } from './media.interface'

export default {
  addMedia: async (media: IMedia) => instance.put('/media', media),
  getMediaByName: async (name: string): Promise<IMedia> => instance.get(`/media/${encodeURIComponent(name)}`),
  removeMedia: async (name: string) => instance.delete(`/media/${encodeURIComponent(name)}`),
  getAllMedia: async (): Promise<IMedia[]> => {
    const { data } = await instance.get('/media')
    return data
  },
}
