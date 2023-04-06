import instance from "./http";
import {FileMap} from "./filemanager.interface";

export default {
  getMapsByMediaId: async (mediaId: string): Promise<FileMap[]> => {
    const { data } = await instance.get(`/filemanager/${mediaId}`)
    return data
  },
  addFileMapping: async (fileMap: Partial<FileMap>): Promise<FileMap> => {
    const { data } = await instance.post(`/filemanager/${fileMap.mediaId}/mapping`, fileMap)
    return data
  }

}