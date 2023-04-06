import {IMedia, IMediaInput} from "../../services/api/media.interface";

export function isInMedia(media: IMedia[], id: string): boolean {
  return media.find((m) => m.thetvdbid === id) !== undefined;
}

export function isFullSeason(filesLength: number, episodes: number): boolean {
  return filesLength >= episodes
}

export function getMediaIDFromMedia(media: IMedia[], id: string): string | undefined {
  return media?.find((m) => m.thetvdbid === id)?.id
}