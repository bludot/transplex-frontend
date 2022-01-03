import React, { useEffect } from 'react'
import { getMetadata } from '../service'

export default function Image({ id }: { id: string }) {
  const [image, setImage] = React.useState('')
  useEffect(() => {
    getMetadata(id).then(({ picture }) => setImage(picture))
  }, [])
  return image ? (
    <img style={{ height: '322px', width: '225px' }} src={image} alt="anime image" />
  ) : null
}
