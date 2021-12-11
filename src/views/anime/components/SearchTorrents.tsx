import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useParams } from 'react-router'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import QueryString from 'query-string'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

export default function CustomizedDialogs({
  onClose,
  data,
  open,
}: {
  data: any
  open: boolean
  onClose: () => void
}) {
  const params: { id: string } = useParams() as { id: string }

  const handleClose = () => {
    onClose()
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.3,
      editable: false,
    },
    {
      field: 'torrentdata',
      headerName: 'Files',
      renderCell: (params: GridRenderCellParams<{ files: any[] }>) => {
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget)
        }
        const handleClosePopOver = () => {
          setAnchorEl(null)
        }
        const openPopover = Boolean(anchorEl)
        const id = openPopover ? 'simple-popover' : undefined

        return (
          <>
            <Button onClick={handleClick}>Show Files</Button>
            <Popover
              id={id}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={handleClosePopOver}
              open={openPopover}
            >
              {params?.value?.files && (
                <div>
                  {params.value.files.map((file: any) => (
                    <div key={file.name}>
                      {file.name}
                      {' '}
                      (
                      {file.size}
                      )
                    </div>
                  ))}
                </div>
              )}
            </Popover>
          </>
        )
      },
    },
    {
      field: 'seeders',
      headerName: 'Seeders',
      width: 100,
    },
  ]

  const [torrents, setTorrents] = React.useState<any[]>([])
  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  useEffect(() => {
    if (data && open) {
      setLoadingData(true)
      setTorrents([])
      const query = {
        n: 50,
        category: '1_0',
        query: data.title,
      }
      axios
        .get(`http://localhost:1337/nyaapi/search?${QueryString.stringify(query)}`)
        .then((result) => {
          setTorrents(result.data)
          setLoadingData(false)
        })
    }
  }, [data, open])

  return (
    <div>
      <BootstrapDialog
        fullWidth
        maxWidth="xl"
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Search Results for
          {' '}
          {`"${data?.title}"`}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container p={4} style={{ height: 400, width: '100%' }}>
            <DataGrid loading={loadingData} rows={torrents} columns={columns} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
