import instance from './http'

export interface SearchItem {
  objectID: string
  aliases: string[]
  country: string
  id: string
  image_url: string
  name: string
  first_air_time: string
  overview: string
  primary_language: string
  primary_type: string
  status: string
  type: string
  tvdb_id: string
  year: string
  slug: string
  overviews: Overviews
  translations: Translations
  network: string
  remote_ids: RemoteId[]
  thumbnail: string
  anidbid: string
}

export interface Overviews {
  deu: string
  ell: string
  eng: string
  fra: string
  heb: string
  hun: string
  ita: string
  jpn: string
  kor: string
  pol: string
  por: string
  pt: string
  rus: string
  spa: string
  zho: string
  zhtw: string
}

export interface Translations {
  deu: string
  eng: string
  fra: string
  heb: string
  hun: string
  ita: string
  jpn: string
  kor: string
  pol: string
  por: string
  pt: string
  rus: string
  spa: string
  zho: string
  zhtw: string
}

export interface RemoteId {
  id: string
  type: number
  sourceName: string
}


export default {
  search: async (query: string): Promise<SearchItem[]> => {
    const {
      data,
    }: {
      data: SearchItem[]
    } = await instance.get(`/search?query=${encodeURIComponent(query)}`)// axios.get(`http://localhost:1337/search?query=${encodeURIComponent(query)}`)
    return data
  },
}
