import type { IContext } from '../../initializer/types'
import type { Movie } from './types'
import { fail, info } from '../../utils/logger'
import { TVDB_API_BASE_URL } from './conf'
import { getAccessToken } from './getAccessToken'

export interface SearchResponse {
  status: string
  data: Movie[]
}

export async function searchByTitle(context: IContext, title: string) {
  const apiUrl = `${TVDB_API_BASE_URL}/search?query=${encodeURIComponent(title)}`
  const accessToken = await getAccessToken(context)

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  })

  try {
    info(`Fetching data from TVDB for title: ${title}`)
    const response = await fetch(apiUrl, { headers })

    if (!response.ok) {
      fail(`Error fetching data from TVDB for title: ${title}, status: ${response.status}, statusText: ${response.statusText}`)
      return null
    }

    const resp = await response.json<SearchResponse>()
    if (resp.status !== 'success') {
      fail(`Successfully fetched data from TVDB for title:`, resp)
      return null
    }

    info(`Successfully fetched data from TVDB for title: ${title}`)
    return resp.data
  } catch (error) {
    fail(`Error fetching data from TVDB for title: ${title}, error: ${error}`)
    return null
  }
}