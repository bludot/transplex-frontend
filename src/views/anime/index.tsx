import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import SearchIcon from '@mui/icons-material/Search'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import EventIcon from '@mui/icons-material/Event'
import Fade from '@mui/material/Fade'
import TvIcon from '@mui/icons-material/Tv'
import SearchTorrents from './components/SearchTorrents'

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
      backgroundImage: `url(${data?.picture})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(8px)',
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
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'episode',
      headerName: 'Episode',
      width: 150,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams<String>) => {
        switch (params.value) {
        case 'FINISHED':
          return <Chip label="Finished" color="primary" />
        case 'RELEASING':
          return <Chip label="Releasing" color="secondary" />
        case 'NOT_YET_RELEASED':
          return <Chip label="Not Yet Released" color="default" />
        default:
          return <Chip label="Unknown" color="warning" />
        }
      },
    },
  ]
  const params: { id: string } = useParams() as { id: string }
  const [data, setData] = useState<any>({})
  const [torrentdialog, setTorrentdialog] = useState<boolean>(false)
  useEffect(() => {
    setData({})
    axios.get(`http://localhost:1337/metadata/anime/${params.id}`).then((data: any) => {
      setData(data.data)
    })
  }, [params.id])

  const searchTorrents = () => {
    console.log('clicked')
    setTorrentdialog(true)
  }
  const closeTorrentDialog = () => {
    setTorrentdialog(false)
  }
  return (
    <Box sx={{overflowX: 'hidden'}}>
      <SearchTorrents open={torrentdialog} onClose={closeTorrentDialog} data={data} />
      <AnimeBox sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid container spacing={2} style={{ zIndex: 1, position: 'relative' }}>
          <Grid item xs={2} style={{ height: '100%' }}>
            {data.picture ? (
              <Fade in>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img
                  style={{ height: '322px', width: '225px' }}
                  src={data?.picture}
                  alt="anime image"
                />
              </Fade>
            ) : (
              <Skeleton variant="rectangular" animation="wave" width={225} height={322} />
            )}
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
            <Grid container spacing={2} mt={2} alignItems="center">
              <Grid item>
                <Button color="primary" variant="contained" disabled={!data} onClick={searchTorrents}>
                  <SearchIcon fontSize="large" sx={{ color: 'white' }} />
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" variant="contained">
                  <CloudDownloadIcon fontSize="large" sx={{ color: 'white' }} />
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body1" component="div" gutterBottom color="#F4F4F4">
              {data.description}
            </Typography>
          </Grid>
        </Grid>
      </AnimeBox>
      <Stack spacing={2}>
        <Grid container p={4} style={{ height: 400, width: '100%' }}>
          <Typography variant="h4" component="div" gutterBottom color="#666">
            Episodes
          </Typography>
          <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <div style={{ flex: '1 1 auto' }}>
              {data?.episodes && (
                <DataGrid
                  rows={[...new Array(parseInt(data?.episodes, 10))].fill(0).map((_, i) => ({
                    id: i,
                    episode: `Episode ${i + 1}`,
                    status: 'unknown',
                  }))}
                  columns={columns}
                  checkboxSelection
                  disableSelectionOnClick
                />
              )}
            </div>
          </div>
        </Grid>
      </Stack>
    </Box>
  )
}

const StyledAnime = styled(Anime)``

export default StyledAnime
