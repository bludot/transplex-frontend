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

const StyledBox = styled(Box)(({ theme }: { theme: any }) => ({
  // background
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: `${theme.spacing(2)}`,
  '&:before': {
    content: '\'\'',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 100%)',
  },
}))
const Anime: React.FC<any> = () => {
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
    <Box>
      <SearchTorrents open={torrentdialog} onClose={closeTorrentDialog} data={data} />
      <StyledBox sx={{ flexGrow: 1 }} style={{ backgroundImage: `url(${data?.picture})` }}>
        <Grid container spacing={2} style={{ zIndex: 1, position: 'relative' }}>
          <Grid item xs={2} style={{ height: '100%' }}>
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img style={{ height: '100%', width: 'auto' }} src={data?.picture} alt="anime image" />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="h2" component="div" gutterBottom color="#F4F4F4">
                  {data.title}
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" variant="contained" onClick={searchTorrents}>
                  <SearchIcon fontSize="large" sx={{ color: 'white' }} />
                </Button>
              </Grid>
              <Grid item>
                <Button color="secondary" variant="contained">
                  <CloudDownloadIcon fontSize="large" sx={{ color: 'white' }} />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item>
                <Item>
                  Type:
                  {data.type}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  Seasons:
                  {data.seasons}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  Year:
                  {data.year}
                </Item>
              </Grid>
              <Grid item>
                <Item>
                  <Grid container spacing={1} alignContent="center">
                    <Grid xs item>
                      <Box component={VideoLibraryIcon} sx={{ color: 'text.secondary' }} />
                    </Grid>
                    <Grid item>
                      Episodes:
                      {data.episodes}
                    </Grid>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
            <Typography variant="body1" component="div" gutterBottom color="#F4F4F4">
              {data.description}
            </Typography>
          </Grid>
        </Grid>
      </StyledBox>
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
