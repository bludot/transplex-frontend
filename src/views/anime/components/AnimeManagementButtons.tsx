import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { addSeries, getMediaByName, removeSeries } from '../service'

export default function AnimeManagementButtons({
  data,
  searchTorrents,
}: {
  data: any
  searchTorrents: any
}) {
  const [isAdded, setIsAdded] = useState(false)
  useEffect(() => {
    if (data) {
      getMediaByName(data.name).then((res: any) => {
        if (res.data) {
          setIsAdded(true)
        }
      })
    }
  }, [])
  return (
    <Grid container spacing={2} mt={2} alignItems="center">
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={
            isAdded
              ? () => removeSeries(data.name).then(() => setIsAdded(false))
              : () => {
                addSeries({
                  name: data.name,
                  type: data.type,
                  anime: true,
                  watch: false,
                  thetvdbid: data.id.toString(),
                }).then(() => setIsAdded(true))
              }
          }
        >
          {isAdded ? (
            <CheckCircleIcon fontSize="large" sx={{ color: 'white' }} />
          ) : (
            <AddIcon fontSize="large" sx={{ color: 'white' }} />
          )}
        </Button>
      </Grid>
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
  )
}
