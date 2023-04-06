
import Search from "../components/Search";
import {SearchItem} from "../services/api/search";
import api from '../services/api'
import Header from "../components/Header";
import {useNavigate} from "react-router-dom";

function Dashboard({children, Sidebar}: {children: any, Sidebar?: any}) {
  const navigate = useNavigate()

  return (
    <>
      <Header>
        <div className={"flex flex-row items-center space-x-2"}>
        <span>Search</span>
        <Search<SearchItem>
          searchFunction={api.search.search}
          className="relative w-72 z-10"
          parseSearchResult={(item) => item.name}
          mapFunction={
            (selectItem) => (item) => (
              <div onClick={() => {
                selectItem(item)
                navigate(`/anime/${item.id.split('-')[0].toLowerCase()}/${item.id.replace(/[^0-9.]/gm, '')}`)
              }}
                   className="flex flex-row items-center  space-x-2"
              >
                {/* @ts-ignore */}
                <img src={`${global.config.api_host}/metadata/anime/${item.id.split('-')[0].toLowerCase()}/${item.id.replace(/[^0-9.]/gm, '')}/poster`}
                     alt={item.name}
                     style={{width: '100px', height: 'auto'}}
                />
                <span>{item.name}</span>
              </div>
            )
          }/>
        </div>
      </Header>
      <div className="w-full">
        {Sidebar && <Sidebar/>}
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </>
  )
}

export default Dashboard
