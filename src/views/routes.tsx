import React from 'react'
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom'
import Dashboard from '../layouts/dashboard'
import {useReactQuerySubscription} from "../services/webstocket";
// import ProtectedAuth from './components/protectedRoute'


export default function App() {
  const Home = React.lazy(() => import('./index'))
  const Anime = React.lazy(() => import('./anime'))
  // const Series = React.lazy(() => import('./anime'))

  useReactQuerySubscription()
  return (
    <Router>
      <Dashboard>
        <Routes>
          <Route index path="/" element={<Home/>} />
          <Route path="/anime/:type/:id" element={<Anime />} />

          {/*<Route path="/anime">*/}
          {/*  <Series />*/}
          {/*</Route>*/}
          {/* not found */}
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </Dashboard>
    </Router>
  )
}
