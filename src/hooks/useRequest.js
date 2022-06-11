import axios from 'axios'

export const useRequest = () => {
  const get = async (url, headers) => {
    try {
      const req = await axios({
        method: 'get',
        url: url,
        headers: headers
      })

      // const data = await req.data

      return await req.data
    } catch (e) {
      return e.response.status
    }
  }

  const post = async (url, data, headers) => {
    try {
      const req = await axios({
        method: 'post',
        url: url,
        data: data,
        headers: headers
      })
      // const res = await req.data

      return await req.data
    } catch (e) {
      return e.response.status
    }
  }

  return {
    get,
    post,
  }
}
