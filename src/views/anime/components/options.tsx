import React, {useEffect} from "react";
import Button from "../../../components/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faCloudDownload, faTrash, faMagnifyingGlass, faDiagramProject} from '@fortawesome/free-solid-svg-icons'
import {IMetadata} from "../../../services/api/metadata.interface";
import {IMedia, IMediaInput} from "../../../services/api/media.interface";
import {isInMedia} from "../service";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Modal from "../../../components/Modal";
import SearchTorrents from "./SearchTorrents";
import {addMediaMutation, fetchMedia, removeMediaMutation} from "../../../services/queries";
import MapItemComponent from "./MapEpisodes";

export default function Options({anime, type, id}: { anime: IMetadata, type: string, id: string }) {
  const [showAddButton, setShowAddButton] = React.useState(false)
  const [showRemoveButton, setShowRemoveButton] = React.useState(false)
  const [showTorrentModal, setShowTorrentModal] = React.useState(false)
  const [showMapModal, setShowMapModal] = React.useState(false)

  const queryClient = useQueryClient()
  const {data: media}: { data: IMedia[] | undefined } = useQuery<IMedia[]>(fetchMedia())

  const removeMedia = useMutation(removeMediaMutation(queryClient))

  const addMedia = useMutation(addMediaMutation(queryClient))

  useEffect(() => {
    console.log(media)
    if ((!media || media.length === 0) || media && media.length > 0 && !isInMedia(media, anime.id.toString())) {
      setShowAddButton(true)
      setShowRemoveButton(false)
    } else {
      setShowAddButton(false)
      setShowRemoveButton(true)
    }
    queryClient.invalidateQueries({queryKey: ['media']})

  }, [media, anime, type])

  return (
    <div className="flex flex-row space-x-2">
      {showAddButton && (
        <Button
          className={"gow-0"}
          onClick={() => {
            addMedia.mutate({
              anime: type === "anime",
              type: type,
              watch: true,
              thetvdbid: anime.id.toString(),
              name: anime.name,
            })
          }}
          showLabel={false}
          icon={<FontAwesomeIcon icon={faPlus}/>}
          label={"Test2"}
        />
      )}
      {showRemoveButton && (
        <Button
          className={"gow-0"}
          onClick={() => {
            removeMedia.mutate(anime.name)
          }}
          showLabel={false}
          icon={<FontAwesomeIcon icon={faTrash}/>}
          label={"Test2"}
        />
      )}
      <Button
        icon={<FontAwesomeIcon icon={faDiagramProject}/>}
        showLabel={false} label={"Test"}
        onClick={() => {
          setShowMapModal(true)
        }}
      />
      <Button
        className={"gow-0"}
        onClick={() => {
          setShowTorrentModal(true)
        }}
        showLabel={false}
        icon={<FontAwesomeIcon icon={faMagnifyingGlass}/>}
        label={"Test2"}
      />
      <Button
        className={"gow-0"}
        onClick={() => {
          console.log("Clicked");
        }}
        showLabel={false}
        icon={<FontAwesomeIcon icon={faCloudDownload}/>}
        label={"Test2"}
      />
      <Modal isOpen={showTorrentModal} closeFn={() => setShowTorrentModal(false)} title="Search Torrents">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl">Search Torrent</h1>
          <div className="flex flex-col space-y-2">
            <SearchTorrents query={anime.name} type={type} id={id}/>
            <Button
              className={"gow-0"}
              onClick={() => {
                setShowTorrentModal(false)
              }}
              label={"close"}
            />

          </div>
        </div>
      </Modal>

      <Modal isOpen={showMapModal} closeFn={() => setShowMapModal(false)} title="Map">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl">Map</h1>
          <div className="flex flex-col space-y-2">
              <MapItemComponent items={[]} id={id} type={type} />
            <Button
              className={"gow-0"}
              onClick={() => {
                setShowMapModal(false)
              }}
              label={"close"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}