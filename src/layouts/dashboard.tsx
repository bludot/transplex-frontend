import React from 'react'
import AppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/TextField'
import { styled, alpha } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import throttle from 'lodash/throttle'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { nanoid } from 'nanoid'
import { Link as RouterLink } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import api from '../services/api'

function ListItemLink({
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
    <li {...props}>
      <ListItem button component={renderLink}>
        {children}
      </ListItem>
    </li>
  )
}

interface AnimeResultSource {
  title: string
  description: string
  synonyms: string[]
  type: string
  episodes: number
  tags: string[]
  anidbid: string
  picture: string
  thumbnail: string
  relations: string[]
}

interface AnimeResult {
  // eslint-disable-next-line
  _id: string
  // eslint-disable-next-line
  _score: number
  // eslint-disable-next-line
  _source: AnimeResultSource
  // eslint-disable-next-line
  highlight: {
    title: string
  }
}

interface AnimeResults {
  hits: {
    total: number
    hits: AnimeResult[]
  }
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

// import { SidebarProps } from '../components/Sidebar'

interface DashboardLayoutProps extends React.Attributes {
  Sidebar: React.ReactNode
  children: React.ReactElement | React.ReactElement[]
  className?: string
}
const drawerWidth = 240
const DashboardLayout = ({ children, Sidebar }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [value, setValue] = React.useState<AnimeResult | null>(null)
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState<readonly AnimeResult[]>([])

  const autocompleteService = api.search

  const fetch = React.useMemo(
    () =>
      throttle(
        (request: { input: string }, callback: (results?: readonly AnimeResult[]) => void) => {
          autocompleteService.search(request.input).then((results: AnimeResults) => {
            callback(results.hits.hits.slice(0, 20))
          })
        },
        500,
      ),
    [],
  )

  React.useEffect(() => {
    let active = true

    if (inputValue === '') {
      setOptions(value ? [value] : [])
      return undefined
    }

    fetch({ input: inputValue }, (results?: readonly AnimeResult[]) => {
      if (active) {
        let newOptions: readonly AnimeResult[] = []

        if (value) {
          newOptions = [value]
        }

        if (results) {
          newOptions = [...newOptions, ...results.slice(0, 20)]
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [value, inputValue, fetch])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const container = window !== undefined ? () => window.document.body : undefined
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            TransPlex
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Autocomplete
            id="google-map-demo"
            sx={{ width: 300 }}
            // eslint-disable-next-line
            // @ts-ignore
            getOptionLabel={(option) =>
              // eslint-disable-next-line no-underscore-dangle
              (typeof option === 'string' ? option : option._source.title)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event: any, newValue: AnimeResult | null) => {
              setOptions(newValue ? [newValue, ...options] : options)

              setValue(newValue)
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            // @ts-ignore
            renderInput={(params) => (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              </Search>
            )}
            renderOption={(props, option) => {
              // eslint-disable-next-line
              // @ts-ignore
              const fulltext = option?.highlight.title[0]
              if (!fulltext) {
                return null
              }
              const matchRes = fulltext ? fulltext.match(/<b>(.+?)<\/b>/) : []
              const matchtext = matchRes ? matchRes[1] : ''

              // eslint-disable-next-line no-underscore-dangle
              const matches = match(option._source.title, matchtext)

              // eslint-disable-next-line no-underscore-dangle
              const parts = parse(option._source.title, matches)

              // eslint-disable-next-line jsx-a11y/img-redundant-alt,no-underscore-dangle
              const thumbnail = () => (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  style={{ width: 'auto', height: '100px' }}
                  // eslint-disable-next-line no-underscore-dangle
                  src={option._source.thumbnail}
                  alt="query image"
                />
              )

              return (
                // eslint-disable-next-line no-underscore-dangle
                <ListItemLink to={`/anime/${option._source.anidbid}`} {...props} key={nanoid()}>
                  <Grid container alignItems="center">
                    <Grid xs item>
                      <Box component={thumbnail} sx={{ color: 'text.secondary', mr: 2 }} />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part) => (
                        <span
                          // eslint-disable-next-line react/no-array-index-key, no-underscore-dangle
                          key={nanoid()}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                      {/*
                      <Typography variant="body2" color="text.secondary">
                        {parts.text}
                      </Typography>
                      */}
                    </Grid>
                  </Grid>
                </ListItemLink>
              )
            }}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {Sidebar}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {Sidebar}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        style={{ padding: 0 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

DashboardLayout.defaultProps = {
  className: '',
}

const StyledDashboardLayout = styled(DashboardLayout)`
  display: grid;
  grid-template-columns: 80px auto;
  grid-template-rows: auto;
  height: 100vh;
  width: 100vw;
  background: #1c1c1c;
  > div {
    position: relative;
  }
`

export default StyledDashboardLayout
