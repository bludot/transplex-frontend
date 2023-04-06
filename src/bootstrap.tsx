import React, {useState, Suspense, useEffect} from 'react'
import configApi from './services/api/config'
import socketHandler from "./services/socket";

// import socketHandler from './services/socket'


// then run the saga

const Bootstrap = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    configApi.fetch().then((conf) => {
      console.log("fetched config")
      console.log(conf)
      // @ts-ignore
      global.config = conf
      setLoaded(true)
      socketHandler.connect()
      socketHandler.getSocket().on('connection', (data: any) => {
        setLoaded(true)
      })
    })
  }, [])
  if (loaded) {
    console.log("loaded config")
    const App = React.lazy(() => import('./views/routes'))
    const QueryProvider = React.lazy(() => import('./queryProvider'))
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <QueryProvider>
          <App/>
        </QueryProvider>
      </Suspense>
    )
  }
  return null
}

export default Bootstrap
