import instance from './http'

export default {
  search: async (query: string) => {
    const {
      data,
    } = await instance.get(`/search?query=${encodeURIComponent(query)}`)// axios.get(`http://localhost:1337/search?query=${encodeURIComponent(query)}`)
    return data
  },
}
