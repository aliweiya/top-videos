// Copyright (c) 2019 轻剑快马
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const { request } = require('../utils/index')

function generateMinute(minutes = 0) {
  if (minutes < 10) {
    return 0
  } else {
    return Math.ceil(minutes / 10) * 10
  }
}

const D = new Date()
const startTime = new Date(
  D.getUTCFullYear(),
  D.getUTCMonth(),
  D.getDate() - 1,
  D.getHours(),
  generateMinute(D.getMinutes()),
  0,
  0
).getTime()

const BASE = 'http://www.acfun.cn/'
const URL = `http://webapi.acfun.cn/query/rank?parentChannelIds=&channelIds=&size=30&typeIds=1,3&sort=pageView&contributeTimeStart=${startTime}&isFource=true&order=1&page=1`

exports.handler = async (event, context) => {
  const res = await request(URL, false).then(res => JSON.parse(res))

  let rankList = []

  if (res.code === 200) {
    rankList = res.data.hits.map((item, index) => {
      return {
        rank: index,
        origin: 'ACFUN',
        title: item.title,
        url: `${BASE}${item.channel_path}/ac${item.id}`,
        score: item.view_count,
        favorite: false
      }
    })
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rankList)
  }
}
