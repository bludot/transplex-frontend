import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { getAllMedia } from './service'
import { IMedia } from '../../services/api/media.interface'
import Image from './components/Image'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

function ItemLink({
  children,
  to,
  ...props
}: {
  children: React.ReactElement | React.ReactElement[]
  to: string
}) {
  const renderLink = React.useMemo(
    () =>
      // eslint-disable-next-line max-len
      React.forwardRef<HTMLAnchorElement, any>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
      )),
    [to],
  )

  return (
    <Item {...props}>
      <Grid component={renderLink}>{children}</Grid>
    </Item>
  )
}

export default function Series() {
  const [series, setSeries] = React.useState<IMedia[]>([])
  useEffect(() => {
    getAllMedia().then((res) => {
      setSeries(res)
    })
  }, [])
  return (
    <Box sx={{ overflowX: 'hidden', padding: '1em 1em' }}>
      <Typography variant="h1">Series</Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {series.map((item, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <ItemLink to={`/anime/${item.thetvdbid.toString()}`}>
              <Image type={item.type.toString()} id={item.thetvdbid.toString()} />
              <Typography variant="h5">{item.name}</Typography>
            </ItemLink>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
