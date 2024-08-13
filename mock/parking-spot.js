const Router = require('koa-router')
const router = new Router()

router.post('/config/addr/delete', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    msg: 'SUCCESS',
  }
})

router.post('/config/addr/add', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    msg: 'SUCCES',
  }
})

router.get('/config', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    res: {
      addrs: ['c4:c1:7d:e4:01:8c', '11:22:33:44:55:66'],
      maxCheckInterval: 10,
      deviceFarAwayTimeout: 10,
    },
  }
})

router.post('/config/save', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    code: 0,
    msg: 'SUCCESS',
  }
})

module.exports = router.routes()
