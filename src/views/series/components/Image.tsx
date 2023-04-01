import React, { useEffect } from 'react'
import { getMetadata } from '../service'

export default function Image({ type, id }: { id: string, type: string }) {
  const [image, setImage] = React.useState('')
  useEffect(() => {
    getMetadata(type, id).then(({ picture }) => setImage(picture))
  }, [])
  return image ? (
    <img style={{ height: '322px', width: '225px' }} src={image} alt="anime image" />
  ) : null
}
