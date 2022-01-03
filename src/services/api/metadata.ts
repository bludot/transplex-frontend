import instance from './http'
import { IMetadata } from './metadata.interface'

export default {
  async getMetadataByanidbId(id: string): Promise<IMetadata> {
    const { data }: {data: IMetadata & {readonly tags: string} } = await instance.get(`/metadata/anime/${id}`)
    return {
      ...data,
      tags: data.tags.split(','),
    }
  },
}
