import React, {Fragment} from "react";
import {Episode} from "../../../services/api/metadata.interface";
import {parse, format, isDate} from "date-fns";
import {faBookmark, faCircleChevronUp, faCircleChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Transition} from "@headlessui/react";
import Button from "../../../components/Button";
import {ISeriesUpdate} from "../../../services/socket/interfaces";
import {useQueryClient} from "@tanstack/react-query";
import {FileMap} from "../../../services/api/filemanager.interface";

interface EpisodeWtihStatus extends Episode {
  status: string

  progress: number

}

function Table({seasonNumber, episodes}: { seasonNumber: number, episodes: EpisodeWtihStatus[] }) {
  const [collapsed, setCollapsed] = React.useState<boolean>(false)
  return (
    <div className="inline-block min-w-full overflow-hidden rounded-lg shadow m-auto">
      <div className={"flex flex-row flex-grow flex-nowrap p-5 space-x-5 items-center bg-white"}>
        <FontAwesomeIcon size="2xl" color="#666" icon={faBookmark}/>
        <h1 className={"text-left text-2xl font-normal"}>Season {seasonNumber == 0 ? "Specials" : seasonNumber}</h1>
        {/*transition arrow direction*/}
        <Button
          color={'transparent'}
          showLabel={false}
          label={'collapse'}
          onClick={() => setCollapsed(!collapsed)}
          icon={<FontAwesomeIcon size="2xl" color="#666"
                                 icon={collapsed ? faCircleChevronDown : faCircleChevronUp}/>}/>
      </div>
      <Transition
        show={collapsed}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <table className="table-auto leading-normal w-full">
          <thead>
          <tr>
            <th scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
            >
              #
            </th>
            <th scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Name
            </th>
            <th scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Aired
            </th>
            <th scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Status
            </th>
            <th scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200">Progress
            </th>
          </tr>
          </thead>
          <tbody>
          {episodes.map((episode) => {
            const airdate = parse(episode.aired, 'yyyy-MM-dd', new Date())
            const formattedAirdate = isDate(airdate) ? format(airdate, 'dd MMM yyyy') : "TBA"

            return (
              <tr key={episode.id}>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {/*<RouterLink to={`/anime/${type}/${id}/${episode.id}`}>*/}
                  {/*{`Episode ${index+1}`}*/}
                  {episode.number}
                  {/*</RouterLink>*/}
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {/*<RouterLink to={`/anime/${type}/${id}/${episode.id}`}>*/}
                  {episode.name}
                  {/*</RouterLink>*/}
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {formattedAirdate}
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {episode.status}
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  { /* show progress */}

                  <div className="w-full bg-gray-200 w-20 rounded-full h-4 dark:bg-gray-700">
                    <div className="bg-blue-600 h-4 rounded-full" style={{width: `${episode.progress}%`}}></div>
                  </div>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </Transition>
    </div>
  )
}

function Tables({
                  episodes,
                  downloadStats,
                  filemaps
                }: { episodes: Episode[], downloadStats: ISeriesUpdate, filemaps: FileMap[] }) {
  // combine download stats and filemaps
  console.log("filemaps", filemaps)
  console.log("downloadStats", downloadStats)
  const episodesWithStatus: EpisodeWtihStatus[] = filemaps && downloadStats ? episodes.map((episode) => {
    const filemap = filemaps?.find((filemap) => filemap.episodeNumber.toString() == episode.number.toString())
    if (!filemap) {
      return {
        ...episode,
        status: "unknown",
        progress: 0
      }
    }
    const download = downloadStats.files.find((downloadFile) => downloadFile.name.split("/").pop() == filemap.fileName)
    if (!download) {
      return {
        ...episode,
        status: "unknown",
        progress: 0
      }
    }
    const status = download?.bytesCompleted == download?.length ? "completed" : "downloading"
    const progress = Math.round((download?.bytesCompleted / download?.length) * 100)
    return {
      ...episode,
      status: status || "unknown",
      progress: progress || 0
    }
  }) : episodes.map((episode) => {
    return {
      ...episode,
      status: "unknown",
      progress: 0
    }
  })
  console.log("episodesWithStatus", episodesWithStatus)
  const episodesBySeason = episodesWithStatus.reduce((acc: Record<string, EpisodeWtihStatus[]>, episode: EpisodeWtihStatus) => {
    if (!acc[episode.seasonNumber]) {
      acc[episode.seasonNumber] = [];
    }
    acc[episode.seasonNumber].push(episode);
    return acc;
  }, {});
  return (
    <div className="flex flex-col flex-grow m-auto space-y-20">
      {Object.entries(episodesBySeason).map(([seasonNumber, episodes]: [string, Episode[]]) => (
        <Table key={seasonNumber} seasonNumber={parseInt(seasonNumber, 10)} episodes={episodes}/>
      ))}
    </div>
  );
}

export default Tables;