import { ISearchQuery } from '../../services/api/download.interface'
import api from '../../services/api'
import { IMedia } from '../../services/api/media.interface'

export function addSeries(media: IMedia) {
  return api.media.addMedia(media)
}

export function removeSeries(name: string) {
  return api.media.removeMedia(name)
}

export function getMediaByName(name: string): Promise<IMedia> {
  return api.media.getMediaByName(name)
}

export function searchDownloads(query: ISearchQuery) {
  return api.download.search(query)
}

export function getMetadataByanidbId(id: string) {
  return api.metadata.getMetadataByanidbId(id)
}

export function addDownload(
  mediaName: string,
  magnetLink: string,
  url: string,
  item: number,
  hash: string,
) {
  return api.download.download(mediaName, magnetLink, url, item, hash)
}

export function isFullSeason(filesLength: number, episodes: number): boolean {
  return filesLength >= episodes
}
