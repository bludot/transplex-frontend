import authApi from './auth'
import searchApi from './search'
import configApi from './config'
import downloadApi from './download'
import mediaApi from './media'
import metadataApi from './metadata'

const api = {
  auth: authApi,
  config: configApi,
  search: searchApi,
  download: downloadApi,
  media: mediaApi,
  metadata: metadataApi,
}
export default api
