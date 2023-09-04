import axios from 'axios'

import { API_URL } from '@/constants'

const client = axios.create({
    baseURL: API_URL
})

client.interceptors.request.use((config) => {
    const jwt = localStorage.getItem('token')

    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`
    }

    return config
})

client.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && (error.response.status === 403) | (error.response.status === 401)) {
            window.location.href = '/login'

            localStorage.removeItem('token')
        }

        if (error.response && error.response.status === 404) {

            //window.location.href = '/404'
        }

        return Promise.reject(error)
    }
)

export default client