import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import MovieIcon from '@mui/icons-material/Movie'
import React from 'react'
import {
  Link as RouterLink, BrowserRouter as Router, Switch, Route,
} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import Dashboard from '../layouts/dashboard'
// import ProtectedAuth from './components/protectedRoute'

function ListItemLink({ icon, primary, to }: { icon: any; primary: string; to: string }) {
  const renderLink = React.useMemo(
    () =>
      // eslint-disable-next-line max-len
      React.forwardRef<HTMLAnchorElement, any>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
      )),
    [to],
  )

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

const drawer: React.ReactNode = (
  <div>
    <Toolbar />
    <Divider />
    <List>
      <ListItemLink icon={<SearchIcon />} primary="Search" to="/search" />
    </List>
    <Divider />
    <List>
      <ListItemLink icon={<MovieIcon />} primary="Series" to="/series" />
    </List>
  </div>
)

export default function App() {
  const Anime = React.lazy(() => import('./anime'))
  const Series = React.lazy(() => import('./series'))
  return (
    <Router>
      <Dashboard Sidebar={drawer}>
        <Switch>
          <Route exact path="/">
            <h1>Welcome</h1>
          </Route>
          <Route exact path="/anime/:id">
            <Anime />
          </Route>
          <Route path="/series">
            <Series />
          </Route>
        </Switch>
      </Dashboard>
    </Router>
  )
}
