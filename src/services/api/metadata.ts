import instance from './http'
import { IMetadata } from './metadata.interface'

export default {
  async getMetadataByanidbId(type: string, id: string): Promise<IMetadata> {
    const { data }: {data: IMetadata & {readonly tags: string} } = await instance.get(`/metadata/anime/${type}/${id}`)
    return {
      ...data,
      // tags: [],
      // tags: data.tags.split(','),
    }
  },
}
