import api from "./api";
import {IMedia, IMediaInput} from "./api/media.interface";
import {IMetadata} from "./api/metadata.interface";
import {QueryClient} from "@tanstack/react-query";
import {IDownloadTorrent} from "./api/download.interface";
import {FileMap} from "./api/filemanager.interface";

export const fetchMedia = () => ({
  queryKey: ["media"],
  queryFn: () => api.media.getAllMedia(),
  select: (data: IMedia[]) => data,
})

export const fetchMetadata = (type: string, id: string) => ({
  queryKey: ["metadata", type, id],
  queryFn: () => api.metadata.getMetadataByanidbId(type, id),
  select: (data: IMetadata) => data,
})

export const removeMediaMutation = (queryClient: QueryClient) => ({
  mutationFn: (name: string) => {
    return api.media.removeMedia(name)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['media']})
  }
})

export const addMediaMutation = (queryClient: QueryClient) => ({
  mutationFn: (media: IMediaInput) => {
    return api.media.addMedia(media)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['media']})
  }
})

export const searchTorrentsQuery = (query: string, category: string, n: number) => ({
  queryKey: ["search_torrents", query],
  queryFn: () => api.download.search({
    n,
    category,
    query,
  })
})

export const downloadTorrentMutation = (queryClient: QueryClient) => ({
  mutationFn: (torrentData: IDownloadTorrent) => {
    return api.download.download(torrentData)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['downloads']})
  }
})

export const downloadStatusQuery = (queryClient: QueryClient, mediaId: string) => ({
  queryKey: ["torrent-status", mediaId],
  queryFn: () => queryClient.getQueryData(["torrent-status", mediaId]),
})

export const getMediaByNameQuery = (name: string) => ({
  queryKey: ["media", name],
  queryFn: () => api.media.getMediaByName(name),
})

export const getMediaByTheTvDbIdQuery = (thetvdbid: number) => ({
  queryKey: ["media", thetvdbid],
  queryFn: () => api.media.getMediaByTheTvDbId(thetvdbid),
})

export const getDownloadByMediaIdQuery = (mediaId: string) => ({
  queryKey: ["downloads", mediaId],
  queryFn: () => api.download.getDownloadByMediaId(mediaId),
})

export const getTorrentByHashQuery = (hash: string) => ({
  queryKey: ["torrent", hash],
  queryFn: () => api.torrent.getTorrentByHash(hash),
})

export const getFileMapsByMediaIdQuery = (mediaId: string) => ({
  queryKey: ["filemaps", mediaId],
  queryFn: () => api.fileManager.getMapsByMediaId(mediaId),
})

export const addFileMappingMutation = (queryClient: QueryClient) => ({
  mutationFn: (fileMap: Partial<FileMap>) => {
    return api.fileManager.addFileMapping(fileMap)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['filemaps']})
  }
})