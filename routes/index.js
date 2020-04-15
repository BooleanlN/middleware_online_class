var router = require('koa-router')();
const controller = require('../controller/index')

router.get('/',controller.getMainPage);


module.exports = router;
