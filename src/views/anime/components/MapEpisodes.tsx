// creat component to allow mapping two sets of data

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getMediaIDFromMedia} from "../service";
import React, {useEffect, useState} from "react";
import {IMedia, IMediaInput} from "../../../services/api/media.interface";
import {
  addFileMappingMutation,
  fetchMedia,
  fetchMetadata,
  getDownloadByMediaIdQuery, getFileMapsByMediaIdQuery,
  getMediaByTheTvDbIdQuery, getTorrentByHashQuery
} from "../../../services/queries";
import {Episode, IMetadata} from "../../../services/api/metadata.interface";
import {format, isDate, parse} from "date-fns";
import {IMediaDownload} from "../../../services/api/download.interface";
import {ITorrent} from "../../../services/api/torrent.interface";
import {File} from "../../../services/api/torrent.interface"
import {FileMap} from "../../../services/api/filemanager.interface";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

function getSeasonFromMap(maps: FileMap[], fileName: string): number | undefined {
  return maps.find(map => map.fileName === fileName)?.seasonNumber
}

function getEpisodeFromMap(maps: FileMap[], fileName: string): number | undefined {
  return maps.find(map => map.fileName === fileName)?.episodeNumber
}


export default function MapItemComponent({items, id, type}: { items: any[], id: string, type: string }) {
  const queryClient = useQueryClient()
  const [showSeasonModal, setShowSeasonModal] = useState(false)
  const [showEpisodeModal, setShowEpisodeModal] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<number>(0)
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  const {data: media}: { data: IMedia } = useQuery<IMedia>(getMediaByTheTvDbIdQuery(id))
  const {data: metadata}: { data: IMetadata } = useQuery<IMetadata>(fetchMetadata(type, id))
  const {data: download}: { data: IMediaDownload } = useQuery<IMediaDownload>({
    ...getDownloadByMediaIdQuery(media?.id),
    enabled: !!media
  })
  const {data: torrent, isLoading: torrentIsLoading}: { data: ITorrent } = useQuery<ITorrent>({
    ...getTorrentByHashQuery(download?.hash),
    enabled: !!download
  })

  const {data: filemaps, isLoading: fileMapsIsLoading}: { data: FileMap[] } = useQuery<FileMap[]>({
    ...getFileMapsByMediaIdQuery(media?.id),
    enabled: !!media
  })

  const addFilemap = useMutation(addFileMappingMutation(queryClient))
const [episodesBySeason, setEpisodesBySeson] = useState({})
  useEffect(() => {
    const episodesBySeason2 = metadata?.episodes.reduce((acc: Record<string, Episode[]>, episode) => {
      if (!acc[episode.seasonNumber]) {
        acc[episode.seasonNumber] = [];
      }
      acc[episode.seasonNumber].push(episode);
      return acc;
    }, {});
    setEpisodesBySeson(episodesBySeason2)
  }, [metadata])


  return (
    <>
      {fileMapsIsLoading || torrentIsLoading || !episodesBySeason ? (<Loader/>) : (
        <>
          <table className="table-auto leading-normal w-full">
            <thead>
            <tr>

              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Name
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Series
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Season
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                #
              </th>
            </tr>
            </thead>
            <tbody>
            {torrent.files.map((file: File) => {
              // const airdate = parse(file.aired, 'yyyy-MM-dd', new Date())
              // const formattedAirdate = isDate(airdate) ? format(airdate, 'dd MMM yyyy') : "TBA"
              const season = getSeasonFromMap(filemaps, file.name.split("/").pop() as string)
              const episode = getEpisodeFromMap(filemaps, file.name.split("/").pop() as string)
              return (
                <tr key={file.name}>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    {/*<RouterLink to={`/anime/${type}/${id}/${episode.id}`}>*/}
                    {file.name.split("/").pop() as string}
                    {/*</RouterLink>*/}
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    {season !== undefined ? media.name : '?'}
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <Button textColor={"#666"} className={"font-normal"} color={"transparent"} label={"empty"}
                            onClick={() => {
                              setSelectedFileName(file.name.split("/").pop() as string)
                              setShowSeasonModal(true)
                            }} showLabel={false} icon={<></>}>
                      <span>{season !== undefined ? season : '?'}</span>
                    </Button>
                  </td>
                  <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <Button textColor={"#666"} className={"font-normal"} color={"transparent"} label={"empty"}
                            onClick={() => {
                              setSelectedSeason(season ? season : 0)
                              setSelectedFileName(file.name.split("/").pop() as string)
                              setShowEpisodeModal(true)
                            }} showLabel={false} icon={<></>}>
                      {season !== undefined ? episode : '?'}
                    </Button>
                  </td>

                </tr>
              )
            })}
            </tbody>
          </table>
          <Modal isOpen={showSeasonModal} closeFn={() => setShowSeasonModal(false)} title="Pick Season">
            <div className="flex flex-col space-y-2 overflow-y-auto h-full">
              <h1 className="text-2xl">Pick Season</h1>
              <div className="flex flex-col space-y-2">
                <ul className={"flex flex-col "}>
                  {Object.keys(episodesBySeason).map((season: string) => {
                    return (
                      <li key={season} className={"text-xl hover:bg-gray-200 p-4 border-b border-gray-200"}
                          onClick={() => {
                            addFilemap.mutate({
                              mediaId: media.id,
                              episodeNumber: 0,
                              seasonNumber: parseInt(season),
                              fileName: selectedFileName,
                              episodeName: "",
                              mediaType: media.thetvdbid
                            })
                            queryClient.invalidateQueries(["filemaps", media.id])
                            setShowSeasonModal(false)
                          }}>
                        Season {season}
                      </li>
                    )
                  })}
                </ul>
                <Button
                  className={"gow-0"}
                  onClick={() => {
                    setShowSeasonModal(false)
                  }}
                  label={"close"}
                />
              </div>
            </div>
          </Modal>
          <Modal isOpen={showEpisodeModal} closeFn={() => setShowEpisodeModal(false)} title="Pick Season">
            <div className="flex flex-col space-y-2 overflow-y-auto h-full">
              <h1 className="text-2xl">Pick episode</h1>
              <div className="flex flex-col space-y-2">
                <ul className={"flex flex-col "}>
                  {episodesBySeason && episodesBySeason[selectedSeason]?.map((episode: Episode) => {
                    return (
                      <li key={episode.id} className={"text-xl hover:bg-gray-200 p-4 border-b border-gray-200"}
                          onClick={() => {
                            addFilemap.mutate({
                              mediaId: media.id,
                              episodeNumber: episode.number,
                              seasonNumber: selectedSeason,
                              fileName: selectedFileName,
                              episodeName: episode.name,
                              mediaType: media.thetvdbid
                            })
                            setShowEpisodeModal(false)
                          }}>
                        <div className={"flex flex-row space-x-2"}>
                          <span>{episode.number}</span>
                          <span>{episode.name}</span>
                        </div>
                      </li>
                    )
                  })
                  }
                </ul>
                <Button
                  className={"gow-0"}
                  onClick={() => {
                    setShowEpisodeModal(false)
                  }}
                  label={"close"}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}