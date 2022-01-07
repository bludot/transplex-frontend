import axios from 'axios'
import config from '../../config'

const instance = axios.create({
  baseURL: config.api_host,
  timeout: 100000,
  withCredentials: true,
})

const longInstance = axios.create({
  baseURL: config.api_host,
  timeout: 0,
  withCredentials: true,
})

export { instance as default, longInstance }
