/**
 * Given you have episode number and season number, map them
 * @param file
 * @param episodes
 * @returns
 */
export function mapFileToEpisodeWithSeason(file: any, episodes: any) {
  if (file.episode && file.season) {
    return episodes.find(
      (episode: any) => episode.episode === file.episode && file.season === episode.seasonNumber,
    )
  }
  return mapFilesToEpisodes(file, episodes)
}

/**
 * Sort episodes in array by season and episode number
 * @param episodes
 * @returns
 */
export function sortEpisodes(episodes: any) {
  return episodes.sort((a: any, b: any) => {
    if (a.seasonNumber === b.seasonNumber) {
      return a.episode - b.episode
    }
    return a.seasonNumber - b.seasonNumber
  })
}

/**
 * Convert object of seasons to array of episodes (ordered)
 * (seasons from episodesToSeasons)
 * @param seasons
 * @returns
 */
export function seasonsToEpisodes(seasons: any) {
  return Object.keys(seasons).reduce((acc: any[], season: any) => [...acc, ...seasons[season]], [])
}

/**
 * Convert array of episodes to object of seasons
 * (episodes from metadata)
 * @param episodes
 * @returns
 */
export function episodesToSeasons(episodes: any) {
  return episodes.reduce((acc: any, episode: any) => {
    const season = acc[episode.seasonNumber] || []
    return {
      ...acc,
      [episode.seasonNumber]: [...season, episode],
    }
  }, {})
}

/**
 * Given an episode number without season, map to the episode with the season
 * @param episodeNumber
 * @param episodes
 * @returns
 */
export function getEpisodeFromEpisodeNumber(episodeNumber: any, episodes: any) {
  // const seasons = episodesToSeasons(episodes)
  const episode = episodes.find((searchEpisode: any, i: number) => {
    /* if (searchEpisode.episode === episodeNumber) {
      return searchEpisode
    } */
    if (i + 1 === episodeNumber) {
      return searchEpisode
    }
    return null
  })
  return episode
}

export function getEpisodeByOtherMeans(file: any, episodes: any) {
  const episode = episodes.find((episode: any) => {
    if (file.year) {
      return file.year.toString() === episode.aired.toString().slice(0, 4)
    }
    return false
  })
  return episode || false
}

export function mapFilesToEpisodes(files: any[], episodes: any[]) {
  const sortedEpisodes = sortEpisodes(episodes)
  return files
    .map((file) => {
      const episode = getEpisodeFromEpisodeNumber(file.episode, sortedEpisodes)
      if (!episode) {
        const alternativeEpisode = getEpisodeByOtherMeans(file, sortedEpisodes)
        if (alternativeEpisode) {
          return {
            ...file,
            ...alternativeEpisode,
            seasonNumber: 0,
            season: 0,
          }
        }
        return null
      }
      return {
        ...file,
        ...episode,
      }
    })
    .filter((episode: any) => episode)
}
