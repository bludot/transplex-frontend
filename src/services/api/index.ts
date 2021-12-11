import authApi from './auth'
import searchApi from './search'
import configApi from './config'

const api = {
  auth: authApi,
  config: configApi,
  search: searchApi
}
export default api
