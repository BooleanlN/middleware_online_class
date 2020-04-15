let query = require('./conn')

// 获取入库/未入库课程
exports.getClassList = (is_shift) => {
  let _sql
  if(is_shift == null)
    _sql = `select * from course_table where is_shift is null`
  else
    _sql = `select * from course_table where is_shift = ${is_shift}`
  return query(_sql)
}

// 获取指定课程
exports.getCourse= (course_id) => {
  let _sql = `select * from course_table where course_id = ${course_id}`
  return query(_sql)
}

exports.updateCourse = (course_id,args) => {
  let updateBody = ""
  Object.keys(args).forEach(key => {
    if(typeof(args[key])==='object' && key!=='course_id'){
      updateBody+=key+"='"+JSON.stringify(args[key])+"',"
    }else if(key!=='course_id'){
      updateBody+=`${key}='${args[key]}',`
    }
  })
  updateBody = updateBody.substring(0,updateBody.length-1)
  let _sql = `update course_table set ${updateBody} where course_id='${course_id}'`
  // console.log(_sql)
  return query(_sql)
}
// 更新学生课程表
exports.updateStuCourse = (course_id,args)=>{
  let updateBody = ""
  if(args.hasOwnProperty('catalogtree')){
    updateCatalogtree(args.catalogtree,course_id)
  }
  // 更新目录树以外的字段
  Object.keys(args).forEach(key => {
    if(key=='course_name'){
      updateBody+=`${key}='${args[key]}',`
    }
    if(key==='norm_sum'){
      updateBody+=`total_time=${args[key]}`
    }
  })
  let _sql = `update stu_course_table set ${updateBody} where course_id='${course_id}'`
  return query(_sql)
}
// 更新目录树接口
updateCatalogtree = async (catalogtree,course_id) => {
  let _sql1 = `select exam_id,catalogtree from stu_course_table where course_id ='${course_id}'`
  let students = []
  await query(_sql1).then(res =>{
   // console.log(res)
    students = res
  })
  for(let i=0;i<students.length;i++){
    let newCata = JSON.parse(JSON.stringify(catalogtree))
    throughCata(newCata['catalogtree'],JSON.parse(students[i]['catalogtree']).catalogtree)
    newCata = JSON.stringify(newCata)
    let _sql = `update stu_course_table set catalogtree = '${newCata}' where exam_id = '${students[i].exam_id}' and course_id = '${course_id}'`
    await query(_sql).then(res => {
      console.log(res)
    })
  }
}
// 找到对应相同id结点
findNode = (obj,id) => {
  for(let i=0;i<obj.length;i++){
    if(obj[i].hasOwnProperty('vid') && obj[i].id === id) return obj[i]
    if(obj[i].hasOwnProperty('children')){
      let temp = findNode(obj[i].children,id)
      if(temp)
        return temp
    }
  }
  return false
}
// 比对新旧目录树
throughCata = (catalog,oldData) => {
  for(let i=0;i<catalog.length;i++){
    if(catalog[i].hasOwnProperty('vid')){ //找到所有vid结点，完善之前的进度
      let obj = findNode(oldData,catalog[i].id)
      console.log('查找节点',obj)
      if(obj){
        catalog[i].finished = obj.finished
        if(obj.validated)
          catalog[i].validated = obj.validated
      }
    }
    if(catalog[i].hasOwnProperty('children')){
      throughCata(catalog[i]['children'],oldData)
    }
  }
}
