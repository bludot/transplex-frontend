export interface ISearchQuery {
  readonly n: number
  readonly category: string
  readonly query: string
}

export interface ITorrent {
  id: string
  name: string
  hash: string
  date: string
  filesize: string
  category: string
  sub_category: string
  magnet: string
  torrent: string
  seeders: string
  leechers: string
  completed: string
  status: string
  torrentdata: Torrentdata
}

export interface Torrentdata {
  files: File[]
}

export interface File {
  path: string
  name: string
  length: number
  offset: number
  regex: Regex
}

export interface Regex {
}

export interface IDownloadTorrent {
  mediaName: string,
  magnetLink: string,
  url: string,
  item: number,
  hash: string,
}

export interface IMediaDownload {
  id: string
  mediaId: string
  item: number
  watchlistId: any
  status: string
  data: any
  added: string
  magnetlink: string
  hash: string
  completed: any
  createdAt: string
  updatedAt: string
}
