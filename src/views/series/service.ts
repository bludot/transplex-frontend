import api from '../../services/api'
import { IMetadata } from '../../services/api/metadata.interface'

export function getAllMedia() {
  return api.media.getAllMedia()
}

export function getMetadata(id: string): Promise<IMetadata> {
  return api.metadata.getMetadataByanidbId(id)
}
