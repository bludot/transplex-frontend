import {useQueryClient} from "@tanstack/react-query";
import React from "react";
import socketHandler from "./socket";
import {ISeriesUpdate} from "./socket/interfaces";

export const useReactQuerySubscription = () => {
  const queryClient = useQueryClient()
  React.useEffect(() => {
    const websocket = socketHandler.getSocket()

    websocket.on('series_download_progress', (data: ISeriesUpdate) => {

      queryClient.setQueryData(['torrent-status', data.mediaId], (oldData: ISeriesUpdate) => {
        return {...oldData, ...data}
      })
    })

    // return () => {
    //   websocket.close()
    // }
  }, [queryClient])
}