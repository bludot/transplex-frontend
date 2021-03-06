import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { getMediaByName } from '../service'
import socketHanlder from '../../../services/socket'

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
    width: 300,
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

const MovieTable = ({ title, data }: { title: string; data: any }) => {
  const [mediaId, setMediaId] = useState('')
  const [mediaData, setMediaData] = useState<any>({
    status: {
      filesSorted: {} as any,
    },
  })
  function updateMedia(title: string) {
    getMediaByName(title).then((resMedia: any) => {
      if (resMedia.data) {
        listenToProgres((data: any) => {
          progress(data, resMedia.data.id, setMediaData)
        })

        setMediaId(resMedia.data.id)
        setMediaData(resMedia.data)
      }
    })
  }
  const progress = (data: any, currentMediaId: string, setMedia: any) => {
    console.log(data.mediaId, currentMediaId)
    console.log(data.mediaId === currentMediaId)
    if (data.mediaId === currentMediaId) {
      const sortedFiles = data.files.reduce(
        (acc: any, file: any) => ({
          ...acc,
          [file.data.episodeNumbers]: {
            ...file,
            status: file.bytesCompleted === file.length ? 'FINISHED' : 'DOWNLOADING',
          },
        }),
        mediaData.status.filesSorted as any,
      )

      setMedia({
        ...mediaData,
        status: {
          ...mediaData.status,
          filesSorted: sortedFiles,
        },
      })
    }
  }

  useEffect(() => {
    if (title) {
      updateMedia(title as string)
    }
    return () => {
      removeListener()
    }
  }, [title])

  return (
    <Grid container p={4} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          minHeight: '400px',
          width: '100%',
        }}
      >
        <div style={{ flex: '1 1 auto' }}>
          {data && (
            <DataGrid
              rows={[
                {
                  id: 0,
                  airDate: data.releases.find((release: any) => release.country === 'global')?.date,
                  name: data.name,
                  status: 'unknown', // mediaData?.status?.filesSorted[i + 1]?.status,
                  progress: 0,
                  /* progress: Math.floor(
                  (mediaData?.status?.filesSorted[i + 1]?.bytesCompleted
                    / mediaData?.status?.filesSorted[i + 1]?.length)
                    * 100,
                ), */
                },
              ]}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
            />
          )}
        </div>
      </div>
    </Grid>
  )
}

export default MovieTable
