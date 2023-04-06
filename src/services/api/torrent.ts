import instance from './http'
import {ITorrent} from "./torrent.interface";
export default {
  getTorrentByHash: async (hash: string): Promise<ITorrent> => {
    const { data } = await instance.get(`/torrents/${hash}`)
    return data
  }
}