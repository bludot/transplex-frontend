import instance from './http'
import {IMedia, IMediaInput} from './media.interface'

export default {
  addMedia: async (media: IMediaInput) => instance.put('/media', media),
  getMediaByName: async (name: string): Promise<IMedia> => {
    const { data } = await instance.get(`/media/${encodeURIComponent(name)}`)
    return data
  },
  removeMedia: async (name: string) => {
    return instance.delete(`/media/${encodeURIComponent(name)}`)
  },
  getAllMedia: async (): Promise<IMedia[]> => {
    const { data } = await instance.get('/media')
    return data
  },
  getMediaByTheTvDbId: async (thetvdbid: number): Promise<IMedia> => {
    const { data } = await instance.get(`/media/thetvdbid/${thetvdbid}`)
    return data
  }
}
