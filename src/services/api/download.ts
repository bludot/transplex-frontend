import QueryString from 'query-string'
import instance, { longInstance } from './http'
import {IDownloadTorrent, ISearchQuery, ITorrent, IMediaDownload} from './download.interface'

export default {
  search: async (query: ISearchQuery): Promise<ITorrent[]> => {
    const { data } = await longInstance.get(`/nyaapi/search?${QueryString.stringify(query)}`)
    return data
  },
  download: async (
    torrentData: IDownloadTorrent
  ) => {
    const { data } = await instance.post('/downloads/add', torrentData)
    return data
  },
  getDownloadByMediaId: async (mediaId: string): Promise<IMediaDownload> => {
    const { data } = await instance.get(`/downloads/mediaid/${mediaId}`)
    return data
  }
}
