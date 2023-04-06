export interface ISeriesUpdate {
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
  updatedAt: string
  torrent: Torrent
  files: File2[]
}

export interface Torrent {
  activityDate: number
  addedDate: number
  bandwidthPriority: number
  comment: string
  corruptEver: number
  creator: string
  dateCreated: number
  desiredAvailable: number
  doneDate: number
  downloadDir: string
  downloadLimit: number
  downloadLimited: boolean
  downloadedEver: number
  error: number
  errorString: string
  eta: number
  fileStats: FileStat[]
  files: File[]
  hashString: string
  haveUnchecked: number
  haveValid: number
  honorsSessionLimits: boolean
  id: number
  isFinished: boolean
  isPrivate: boolean
  leftUntilDone: number
  magnetLink: string
  manualAnnounceTime: number
  maxConnectedPeers: number
  metadataPercentComplete: number
  name: string
  "peer-limit": number
  peers: Peer[]
  peersConnected: number
  peersFrom: PeersFrom
  peersGettingFromUs: number
  peersSendingToUs: number
  percentDone: number
  pieceCount: number
  pieceSize: number
  pieces: string
  priorities: number[]
  rateDownload: number
  rateUpload: number
  recheckProgress: number
  seedIdleLimit: number
  seedIdleMode: number
  seedRatioLimit: number
  seedRatioMode: number
  sizeWhenDone: number
  startDate: number
  status: number
  torrentFile: string
  totalSize: number
  trackerStats: TrackerStat[]
  trackers: Tracker[]
  uploadLimit: number
  uploadLimited: boolean
  uploadRatio: number
  uploadedEver: number
  wanted: number[]
  webseeds: any[]
  webseedsSendingToUs: number
}

export interface FileStat {
  bytesCompleted: number
  priority: number
  wanted: boolean
}

export interface File {
  bytesCompleted: number
  length: number
  name: string
}

export interface Peer {
  address: string
  clientIsChoked: boolean
  clientIsInterested: boolean
  clientName: string
  flagStr: string
  isDownloadingFrom: boolean
  isEncrypted: boolean
  isIncoming: boolean
  isUTP: boolean
  isUploadingTo: boolean
  peerIsChoked: boolean
  peerIsInterested: boolean
  port: number
  progress: number
  rateToClient: number
  rateToPeer: number
}

export interface PeersFrom {
  fromCache: number
  fromDht: number
  fromIncoming: number
  fromLpd: number
  fromLtep: number
  fromPex: number
  fromTracker: number
}

export interface TrackerStat {
  announce: string
  announceState: number
  downloadCount: number
  hasAnnounced: boolean
  hasScraped: boolean
  host: string
  id: number
  isBackup: boolean
  lastAnnouncePeerCount: number
  lastAnnounceResult: string
  lastAnnounceStartTime: number
  lastAnnounceSucceeded: boolean
  lastAnnounceTime: number
  lastAnnounceTimedOut: boolean
  lastScrapeResult: string
  lastScrapeStartTime: number
  lastScrapeSucceeded: boolean
  lastScrapeTime: number
  lastScrapeTimedOut: boolean
  leecherCount: number
  nextAnnounceTime: number
  nextScrapeTime: number
  scrape: string
  scrapeState: number
  seederCount: number
  sitename: string
  tier: number
}

export interface Tracker {
  announce: string
  id: number
  scrape: string
  sitename: string
  tier: number
}

export interface File2 {
  bytesCompleted: number
  length: number
  name: string
  data: Data
}

export interface Data {
  title: string
  year?: string
  resolution?: string
  sources: string[]
  revision: Revision
  edition: Edition
  languages: string[]
  episode: any
  season: any
  group?: string
  complete?: boolean
}

export interface Revision {
  version: number
  real: number
}

export interface Edition {
  extended?: boolean
}
