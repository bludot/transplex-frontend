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

export function sortFiles(files: any) {
  return files.sort((a: any, b: any) => {
    if (a.season === b.season) {
      return a.episode - b.episode
    }
    return a.season - b.season
  })
}

function getFileFromEpisode(episode: any, episodes: any[], files: any[]) {
  const episodeIndex = episodes
    .filter((filterEpisode) => filterEpisode.seasonNumber !== 0)
    .findIndex(
      (searchEpisode: any) =>
        searchEpisode.episode === episode.episode
        && searchEpisode.seasonNumber === episode.seasonNumber,
    )
  const sortedFiles = sortFiles(files)
  return sortedFiles[episodeIndex]
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

export function getFileByOtherMeans(episode: any, files: any) {
  const fileIndex = files.findIndex((searchFile: any) => {
    if (searchFile.year) {
      return searchFile.year.toString() === episode.aired.toString().slice(0, 4)
    }
    return false
  })
  return files[fileIndex]
}

export function mapFilesToEpisodes(files: any[], episodes: any[]) {
  const seasons = episodesToSeasons(episodes)
  const sortedEpisodes = sortEpisodes(episodes)
  // season count
  // const seasonsCount = Object.keys(seasons).length
  const seasonsCountNoSpecial = Object.keys(seasons).filter(
    (season) => season.toString() !== '0',
  ).length
  const episodetofile = sortEpisodes(
    episodes
      .map((episode: any) => {
        const file = files.find(
          (searchFile: any) =>
            searchFile.episode === episode.number && episode.seasonNumber === searchFile.season,
        )
        if (file) {
          return {
            fileName: file.mame,
            ...file,
            ...episode,
          }
        }

        if (episode.episode && seasonsCountNoSpecial.toString() === '1') {
          return {
            ...files.find((searchFile: any) => episode.number === searchFile.episode),
            ...episode,
          }
        }
        const file2 = getFileFromEpisode(episode, sortedEpisodes, files)
        if (!file2) {
          const alternativeFile = getFileByOtherMeans(episode, sortedEpisodes)
          if (alternativeFile) {
            return {
              fileName: alternativeFile?.name,
              ...alternativeFile,
              ...episode,
              seasonNumber: 0,
              season: 0,
            }
          }
          return episode
        }
        return {
          ...file2,
          fileName: file2.name,
          ...episode,
        }
      })
      .filter((episode: any) => episode),
  )
  return episodetofile
}
