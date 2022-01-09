import QueryString from 'query-string'
import instance, { longInstance } from './http'
import { ISearchQuery } from './download.interface'

export default {
  search: async (query: ISearchQuery) => {
    const { data } = await longInstance.get(`/nyaapi/search?${QueryString.stringify(query)}`)
    return data
  },
  download: async (
    mediaName: string,
    magnetLink: string,
    url: string,
    item: number,
    hash: string,
  ) => {
    const { data } = await instance.post('/downloads/add', {
      mediaName,
      magnetLink,
      item,
      hash,
      url,
    })
    return data
  },
}
