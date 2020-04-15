let router = require('koa-router')()
let controller = require('../controller/course')

// router.prefix('/middleware/courses')

// 课程列表获取
router.get('/courseList',controller.getCourses)

// 课程修改
router.get('/courseInfo/:courseId',controller.editCourse)

router.post('/updateCourse',controller.updateCourse)
module.exports = router