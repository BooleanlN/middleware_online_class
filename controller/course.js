const courseModel = require('../model/course')
const moment = require('moment')

exports.getCourses = async ctx => {
  let courses_shifted,courses_unshifted
  await courseModel.getClassList('1').then(res => {
    console.log(res)
    courses_shifted = res
  })
  await courseModel.getClassList(null).then(res => {
    console.log(res)
    courses_unshifted = res
  })
  await ctx.render('index',{
    courses_shifted:courses_shifted,
    courses_unshifted:courses_unshifted
  })
}

exports.editCourse = async ctx => {
  let course_id = ctx.params.courseId
  let course
  await courseModel.getCourse(course_id).then(res => {
    console.log(res)
    course = res[0]
  })
  await ctx.render('courseedit',{
    course:course
  })
}

exports.updateCourse = async ctx => {
  requests =ctx.request.body
  console.log(requests)
  if(requests.catalogtree){
    requests.catalogtree = JSON.parse(requests.catalogtree)
  }
  await courseModel.updateCourse(requests.course_id,requests).then(res => {
    console.log(res)
    courseModel.updateStuCourse(requests.course_id,requests).then(res => {
      console.log(res)
    })
  })
  ctx.status = 200
  ctx.body = {
    "code":200,
    "message":"update success",
  }
}