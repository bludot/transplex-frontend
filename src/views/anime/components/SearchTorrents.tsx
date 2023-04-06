import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ITorrent} from "../../../services/api/download.interface";
import {downloadTorrentMutation, fetchMetadata, searchTorrentsQuery} from "../../../services/queries";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import {IMetadata} from "../../../services/api/metadata.interface";
import TextInput from "../../../components/TextInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faSearch} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import CustomPopover from "../../../components/CustomPopover";


interface SearchTorrentsProps {
  query: string

  type: string

  id: string
}

var SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatBytes(bytes, decimals) {
  for (var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
  return `${parseFloat(r.toFixed(decimals))} ${SIZES[i]}`;
}

export default function SearchTorrents({query, type, id}: SearchTorrentsProps) {
  const queryClient = useQueryClient()
  const ref = useRef(null);
  const [inputSearchQuery, setInputSearchQuery] = useState(query)
  const [searchQuery, setSearchQuery] = useState(query)
  const {data: anime}: { data: IMetadata | undefined } = useQuery<IMetadata>(fetchMetadata(type, id))

  const {data: results, isLoading, refetch} = useQuery<ITorrent[]>(searchTorrentsQuery(searchQuery, '1_0', 50))
  const downloadTorrent = useMutation(downloadTorrentMutation(queryClient))

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputSearchQuery((e.target as HTMLInputElement).value)
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <>
      <div className="flex flex-row space-x-2">
        <TextInput ref={ref} label={"Search"} defaultValue={query} value={inputSearchQuery} onChange={handleChange}/>

        <Button
          className={"gow-0"}
          onClick={() => {
            setSearchQuery(inputSearchQuery)
            refetch()
          }}
          showLabel={false}
          icon={<FontAwesomeIcon icon={faSearch}/>}
          label={"Test2"}
        />
      </div>

      {isLoading ? <Loader/> : (
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow m-auto">
          <table className="table-auto leading-normal w-full">
            <thead>
            <tr>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Name
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Size
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Seeders
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Leechers
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Uploaded
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Files
              </th>
              <th scope="col"
                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
              >
                Download
              </th>
            </tr>
            </thead>
            <tbody>
            {results && results.map((result) => (
              <tr key={result.id}>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{result.name}</td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{result.filesize}</td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{result.seeders}</td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{result.leechers}</td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">{result.date}</td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {/*<a href={"#"} onClick={() => {}}> Show Files</a>*/}
                  <CustomPopover
                    label={<>File List
                      <FontAwesomeIcon icon={faChevronDown} className="ui-open:rotate-180 ui-open:transform"/></>}
                    maxHeight={"300px"}
                  >
                    <div className="flex flex-col space-y-2 bg-white">
                      {result.torrentdata.files?.map((file, index) => (
                        <div key={index} className="flex flex-row space-x-2">
                          <div className="flex-grow">{file.name}</div>
                          <div>{formatBytes(file.length, 2)}</div>
                        </div>
                      ))}
                    </div>

                  </CustomPopover>
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <Button
                    onClick={() => downloadTorrent.mutate({
                        mediaName: anime.name,
                        magnetLink: result.magnet,
                        url: result.torrent,
                        item: 1,
                        hash: result.hash,
                      }
                    )}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    label="Download"
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )


}