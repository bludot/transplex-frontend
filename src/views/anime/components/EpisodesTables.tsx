import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { getMediaByName } from '../service'
import socketHanlder from '../../../services/socket'
import { mapFilesToEpisodes } from '../../../services/utils'

let listening = false
function listenToProgres(func: any) {
  if (!listening) {
    listening = true
    socketHanlder.getSocket().on('series_download_progress', func)
  }
}

function removeListener() {
  socketHanlder.getSocket().removeAllListeners('series_download_progress')
  listening = false
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}))

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'episode',
    headerName: '#',
    width: 50,
    editable: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 800,
  },
  {
    field: 'airDate',
    headerName: 'Air Date',
    width: 100,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params: GridRenderCellParams<String>) => {
      switch (params.value) {
      case 'FINISHED':
        return <Chip label="Finished" color="primary" />
      case 'DOWNLOADING':
        return <Chip label="Downloading" color="secondary" />
      case 'SEEDING':
        return <Chip label="Seeding" color="default" />
      default:
        return <Chip label="Unknown" color="warning" />
      }
    },
  },
  {
    field: 'progress',
    headerName: 'Progress',
    width: 100,
    renderCell: (params: GridRenderCellParams<number>) => (
      <BorderLinearProgress variant="determinate" value={params.value || 0} />
    ),
  },
]

const EpisodeTable = ({ season, episodes }: { season: string; episodes: any[] }) => (
  <Grid container p={4} style={{ width: '100%' }}>
    <Typography variant="h4" component="div" gutterBottom color="#666">
      {season === '0' ? 'Special' : `Season ${season}`}
    </Typography>
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        minHeight: '400px',
        width: '100%',
      }}
    >
      <div style={{ flex: '1 1 auto' }}>
        {episodes && episodes.map && (
          <DataGrid
            rows={episodes.map((episode, i) => ({
              id: i,
              episode: episode.episode || '#',
              airDate: episode.aired,
              name: episode.name,
              status: episode.status,
              progress: episode.progress,
            }))}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
          />
        )}
      </div>
    </div>
  </Grid>
)

const EpisodeTables = ({ seasons, metadata }: { seasons: any; metadata: any }) => {
  const seasonMap = Object.keys(seasons).reduce((acc: any, key: any) => {
    acc[seasons[key]] = seasons[key].map((e: any) => e.episode)
    return acc
  }, {})
  const [mediaId, setMediaId] = useState('')
  const [mediaData, setMediaData] = useState<any>({})
  const [mappedEpisodes, setMappedEpisodes] = useState<any[]>([])
  function updateMedia(title: string) {
    getMediaByName(title).then((resMedia: any) => {
      if (resMedia.data) {
        setMediaId(resMedia.data.id)
        setMediaData(resMedia.data)
        const metaEpisodes = metadata.theTvDb.data.episodes.map((episode: any) => ({
          ...episode,
          episode: episode.number,
        }))
        const files = resMedia.data.status.files.map((file: any) => ({
          ...file,
          ...file.data,
        }))
        const mappedData = mapFilesToEpisodes(files, metaEpisodes).map((episode) => {
          const progress = Math.floor((episode.bytesCompleted / episode.length) * 100)
          return {
            ...episode,
            status: progress / 100 === 1 ? 'FINISHED' : resMedia.data.status.status,
            progress: Math.floor((episode.bytesCompleted / episode.length) * 100),
          }
        })
        setMappedEpisodes(mappedData)

        listenToProgres((data: any) => {
          progress(data, resMedia.data.id, resMedia.data)
        })
      }
    })
  }
  const progress = (data: any, currentMediaId: string, media: any) => {
    console.log(data.mediaId, currentMediaId)
    console.log(data.mediaId === currentMediaId)
    if (data.mediaId === currentMediaId) {
      const metaEpisodes = metadata.theTvDb.data.episodes.map((episode: any) => ({
        ...episode,
        episode: episode.number,
      }))
      const files = data.files.map((file: any) => ({
        ...file,
        ...file.data,
      }))
      const mappedData = mapFilesToEpisodes(files, metaEpisodes).map((episode) => {
        const progress = Math.floor((episode.bytesCompleted / episode.length) * 100)
        return {
          ...episode,
          status: progress / 100 === 1 ? 'FINISHED' : media.status.status,
          progress: Math.floor((episode.bytesCompleted / episode.length) * 100),
        }
      })
      setMappedEpisodes(mappedData)
    }
  }

  useEffect(() => {
    if (metadata.title) {
      updateMedia(metadata.title as string)
    }
    return () => {
      removeListener()
    }
  }, [metadata])
  return (
    <>
      {seasons
        && Object.keys(seasons).map((season: any) => (
          <EpisodeTable
            season={season.toString()}
            episodes={mappedEpisodes.filter(
              (episode) => episode.seasonNumber.toString() === season.toString(),
            )}
          />
        ))}
    </>
  )
}
export default EpisodeTables
