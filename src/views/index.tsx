import {useState} from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import Search from "../components/Search";
import {SearchItem} from "../services/api/search";
import api from '../services/api'
import Header from "../components/Header";
import {useQuery} from "@tanstack/react-query";
import {IMediaInput} from "../services/api/media.interface";
import {fetchMedia} from "../services/queries";
import {Link} from "react-router-dom";

function Home() {
  const {data: media}: { data: IMediaInput[] | undefined } = useQuery<IMediaInput[]>(fetchMedia())


  return (
    <>
      <div className="flex flex-row justify-center min-h-screen py-2 space-x-4">
        {/*  list items in media */}
        {media && media.map((item) => (

          <Link to={`/anime/series/${item.thetvdbid.replace(/[^0-9.]/gm, '')}`}>
            <div className="flex flex-col items-center space-x-2">
              <img
                src={`${global.config.api_host}/metadata/anime/${item.thetvdbid.split('-')[0].toLowerCase()}/${item.thetvdbid.replace(/[^0-9.]/gm, '')}/poster`}
                alt={item.name}
                style={{width: '100px', height: 'auto'}}
              />
              <span>{item.name}</span>
            </div>
          </Link>

        ))}
      </div>

    </>
  )
}

export default Home
