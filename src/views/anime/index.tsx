/* eslint-disable no-underscore-dangle */
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import EventIcon from '@mui/icons-material/Event'
import Fade from '@mui/material/Fade'
import TvIcon from '@mui/icons-material/Tv'
import SearchTorrents from './components/SearchTorrents'
import AnimeManagementButtons from './components/AnimeManagementButtons'
import { getMetadataByanidbId } from './service'
import { IMetadata } from '../../services/api/metadata.interface'
import EpisodeTables from './components/EpisodesTables'
import MovieTable from './components/MovieTable'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  width: 'auto',
  display: 'inline-block',
  backgroundColor: '#666',
  color: 'white',
}))

const Anime: React.FC<any> = () => {
  const AnimeBox = styled(Box)(({ theme }: { theme: any }) => ({
    // background
    position: 'relative',

    padding: `${theme.spacing(2)}`,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundImage: `url(http://localhost:1337/metadata/anime/${data?.anidbid}/fanart)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      // filter: 'blur(8px)',
      width: '120%',
    },

    '&:after': {
      content: '\'\'',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 100%)',
    },
  }))

  const params: { id: string } = useParams() as { id: string }
  const [data, setData] = useState<IMetadata | any>({})
  const [torrentdialog, setTorrentdialog] = useState<boolean>(false)
  const [seasons, setSeasons] = useState<any[]>([])

  useEffect(() => {
    setData({})
    getMetadataByanidbId(params.id.toString()).then((res: IMetadata) => {
      setData(res)
      setSeasons(
        res.theTvDb.data.episodes.reduce(
          (acc: any, episode: any) => ({
            ...acc,
            seasons: {
              ...acc.seasons,

              [episode.seasonNumber]: acc.seasons[episode.seasonNumber]
                ? acc.seasons[episode.seasonNumber].concat({
                  episode: episode.number,
                  name: episode.name,
                  airDate: episode.aired,
                  seasonNumber: episode.seasonNumber,
                })
                : [
                  {
                    episode: episode.number,
                    name: episode.name,
                    airDate: episode.aired,
                    seasonNumber: episode.seasonNumber,
                  },
                ],
            },
          }),
          { seasons: {} },
        ).seasons,
      )
    })
  }, [params.id])

  const searchTorrents = () => {
    console.log('clicked')
    setTorrentdialog(true)
  }
  const closeTorrentDialog = () => {
    setTorrentdialog(false)
  }
  const Image = useMemo(() => {
    // eslint-disable-next-line no-underscore-dangle
    const imageUrl = `http://localhost:1337/metadata/anime/${data.anidbid}/poster`
    return (
      <>
        {data?.theTvDb ? (
          <Fade in>
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img style={{ height: '322px', width: '225px' }} src={imageUrl} alt="anime image" />
          </Fade>
        ) : (
          <Skeleton variant="rectangular" animation="wave" width={225} height={322} />
        )}
      </>
    )
  }, [data.picture])
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <SearchTorrents open={torrentdialog} onClose={closeTorrentDialog} data={data} />
      <AnimeBox sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid container spacing={2} style={{ zIndex: 1, position: 'relative' }}>
          <Grid item xs={2} style={{ height: '100%' }}>
            {Image}
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="h2" component="div" gutterBottom color="#F4F4F4">
                  {data.title ? (
                    <>{data.title}</>
                  ) : (
                    <Skeleton variant="text" animation="wave" width={400} height={93} />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid item>
                <Item>
                  {data.type ? (
                    <Grid container spacing={1} direction="row" alignItems="center">
                      <Grid item style={{ lineHeight: '100%' }}>
                        <TvIcon style={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid item>
                        <span>{data.type}</span>
                      </Grid>
                    </Grid>
                  ) : (
                    <Skeleton height={30} width={65} />
                  )}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  {data.seasons ? (
                    <Grid container spacing={1} direction="row" alignItems="center">
                      <Grid item style={{ lineHeight: '100%' }}>
                        <VideoLibraryIcon style={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid item>
                        <span>{data.seasons}</span>
                      </Grid>
                    </Grid>
                  ) : (
                    <Skeleton height={30} width={65} />
                  )}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  {data.year ? (
                    <Grid container spacing={1} direction="row" alignItems="center">
                      <Grid item style={{ lineHeight: '100%' }}>
                        <EventIcon style={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid item>
                        <span>{data.year}</span>
                      </Grid>
                    </Grid>
                  ) : (
                    <Skeleton height={30} width={65} />
                  )}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  {data.episodes ? (
                    <Grid container spacing={1} direction="row" alignItems="center">
                      <Grid item style={{ lineHeight: '100%' }}>
                        <VideoLibraryIcon style={{ color: 'text.secondary' }} />
                      </Grid>
                      <Grid item>
                        <span>{data.episodes}</span>
                      </Grid>
                    </Grid>
                  ) : (
                    <Skeleton height={30} width={65} />
                  )}
                </Item>
              </Grid>
            </Grid>
            <AnimeManagementButtons data={data} searchTorrents={searchTorrents} />
            <Typography variant="body1" component="div" gutterBottom color="#F4F4F4">
              {data.description}
            </Typography>
          </Grid>
        </Grid>
      </AnimeBox>
      {data?.type !== 'MOVIE' && (
        <Stack spacing={2}>{seasons && <EpisodeTables seasons={seasons} metadata={data} />}</Stack>
      )}
      {data?.type === 'MOVIE' && (
        <Stack spacing={2}>
          <MovieTable title={data.title} data={data.theTvDb.data} />
        </Stack>
      )}
    </Box>
  )
}

const StyledAnime = styled(Anime)``

export default StyledAnime
