import axios from 'axios';

export default {
  search: async (query: string) => {
    const {
      data,
    } = await axios.get(`http://localhost:1337/search?query=${encodeURIComponent(query)}`)
    return data
  },
}
