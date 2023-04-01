import api from '../../services/api'
import { IMetadata } from '../../services/api/metadata.interface'

export function getAllMedia() {
  return api.media.getAllMedia()
}

export function getMetadata(type: string, id: string): Promise<IMetadata> {
  return api.metadata.getMetadataByanidbId(type, id)
}
