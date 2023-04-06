export interface IMetadata {
  id: number
  name: string
  slug: string
  image: string
  nameTranslations: string[]
  overviewTranslations: string[]
  aliases: Alias[]
  firstAired: string
  lastAired: string
  nextAired: string
  score: number
  status: Status
  originalCountry: string
  originalLanguage: string
  defaultSeasonType: number
  isOrderRandomized: boolean
  lastUpdated: string
  averageRuntime: number
  episodes: Episode[]
  overview: string
  year: string
  artworks: Artwork[]
  translations: Translations
  type: string
}

export interface Alias {
  language: string
  name: string
}

export interface Status {
  id: number
  name: string
  recordType: string
  keepUpdated: boolean
}

export interface Episode {
  id: number
  seriesId: number
  name: string
  aired: string
  runtime?: number
  nameTranslations: any
  overview?: string
  overviewTranslations: any
  image?: string
  imageType?: number
  isMovie: number
  seasons: any
  number: number
  seasonNumber: number
  lastUpdated: string
  finaleType?: string
  airsBeforeSeason?: number
  airsBeforeEpisode?: number
  year: string
  airsAfterSeason?: number
}

export interface Artwork {
  id: number
  image: string
  thumbnail: string
  language?: string
  type: number
  score: number
  width: number
  height: number
  thumbnailWidth: number
  thumbnailHeight: number
  updatedAt: number
  status: Status2
  tagOptions: any
  seasonId?: number
}

export interface Status2 {
  id: number
  name: any
}

export interface Translations {
  name: string
  overview: string
  language: string
  aliases: string[]
}
