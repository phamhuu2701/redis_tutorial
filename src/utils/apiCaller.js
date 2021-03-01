const axios = require('axios')

/**
 *
 * @param {String} endpoint
 * @param {String} method
 * @param {Object} data
 * @param {Object} header
 */
module.exports.apiCaller = async (endpoint, method, data, header) => {
  try {
    const res = await axios({
      url: endpoint,
      method: method || 'GET',
      data: data || {},
      headers: header || {},
    })

    return {
      success: true,
      payload: res.data,
    }
  } catch (error) {
    return {
      success: false,
      error: { message: error.message },
    }
  }
}
