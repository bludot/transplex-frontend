import React, {useEffect, useState} from 'react'
import {Link as RouterLink, useParams} from 'react-router-dom'
import api from "../../services/api";
import {IMetadata} from "../../services/api/metadata.interface";
import Loader from "../../components/Loader";
import Options from "./components/options";
import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";
import {downloadStatusQuery, fetchMedia, fetchMetadata, getFileMapsByMediaIdQuery} from "../../services/queries";
import Tables from "./components/Episodes";
import {IMedia, IMediaInput} from "../../services/api/media.interface";
import {ISeriesUpdate} from "../../services/socket/interfaces";
import {getMediaIDFromMedia} from "./service";
import {FileMap} from "../../services/api/filemanager.interface";



function Anime() {
  const {type, id} = useParams<{ type: string, id: string }>()
  const queryClient = useQueryClient()
  const [mediaID, setMediaID] = useState<string | undefined>(undefined)
  const {data: media}: { data: IMedia[] | undefined } = useQuery<IMedia[]>(fetchMedia())
  const {data: anime}: { data: IMetadata | undefined } = useQuery<IMetadata>(fetchMetadata(type, id))
  const {data: downloadStats, downloadStatsIsLoading} = useQuery<ISeriesUpdate>({
    ...downloadStatusQuery(queryClient, getMediaIDFromMedia(media, id)),
    enabled: mediaID !== undefined
  })

  const {data: filemaps, isLoading: fileMapsIsLoading}: { data: FileMap[] } = useQuery<FileMap[]>({
    ...getFileMapsByMediaIdQuery(mediaID),
    enabled: mediaID !== undefined
  })
  useEffect(() => {
    console.log("invalidating")
    queryClient.invalidateQueries({queryKey: ['media']})
    queryClient.invalidateQueries({queryKey: ['metadata']})
    setMediaID(getMediaIDFromMedia(media, id))
  }, [type, id, media])

  return (
    <div className="flex flex-col">
      {/* if anime is null, show loading */}
      {!anime || downloadStatsIsLoading ? <Loader/> : (
        <>
          <div className="relative flex flex-row p-10 text-white overflow-hidden ">
            <div className={"absolute top-0 left-0 bottom-0 right-0"} style={{
              backgroundImage: `url(http://localhost:1337/metadata/anime/${anime?.type}/${anime?.id}/fanart)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              zIndex: -1,
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backgroundBlendMode: 'darken'

            }}/>
            <div className="flex flex-col">
              {/* @ts-ignore */}
              <img src={`${global.config.api_host}/metadata/anime/${type}/${id}/poster`}
                   alt={anime.translations.name}
                   className={"max-w-none"}
                   style={{height: '322px', width: '225px'}}
              />
            </div>
            <div className="flex flex-col space-y-2 p-2">
              <h1>{anime.translations.name}</h1>
              <p>{anime.translations.overview}</p>
              <Options anime={anime} type={type} id={id}/>
            </div>
          </div>
          {/* table of episodes */}
          <div className="flex flex-row space-x-2 p-10 bg-slate-300">
            <Tables episodes={anime.episodes} downloadStats={downloadStats} filemaps={filemaps} />
          </div>
        </>
      )}
    </div>
  )
}

export default Anime