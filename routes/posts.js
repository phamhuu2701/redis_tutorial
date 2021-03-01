require('dotenv').config()

const express = require('express')
const router = express.Router()
const { apiCaller } = require('../src/utils/apiCaller')

const redis = require('redis')
const redisKey = 'posts'

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })

  try {
    redisClient.on('connect', () => console.log('redisClient.on connect'))
    redisClient.on('ready', () => console.log('redisClient.on ready'))
    redisClient.on('reconnecting', () => console.log('redisClient.on reconnecting'))
    redisClient.on('error', () => console.log('redisClient.on error'))
    redisClient.on('warning', () => console.log('redisClient.on warning'))
    redisClient.on('end', () => console.log('redisClient.on end'))

    return redisClient.get(redisKey, async (err, data) => {
      if (err) {
        console.log('redisClient.get err', err)

        throw { message: err.message }
      } else {
        if (data) {
          console.log('redisClient.get data', JSON.parse(data))

          redisClient.del(redisKey, (err, res) => {
            if (err) {
              console.log('redisClient.del err', err)
            } else {
              console.log('redisClient.del success')
            }
          })

          res.json({
            success: true,
            payload: JSON.parse(data),
          })
        } else {
          let posts = await apiCaller('https://viblo.asia/api/announcements')

          redisClient.set(redisKey, JSON.stringify(posts), redis.print)

          res.json(posts)
        }
      }
    })
  } catch (error) {
    res.json({
      success: false,
      error: { message: error.message },
    })
  } finally {
    // redisClient.quit()
  }
})

module.exports = router
