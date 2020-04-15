// const Model = require('../lib/mysql')
const moment = require('moment')

exports.getMainPage = async ctx => {
  //console.log(ctx)
  //ctx.redirect('/posts')
  await ctx.render('index',{
    courses:['a','b'],
    title:'课程列表'
  })
}
