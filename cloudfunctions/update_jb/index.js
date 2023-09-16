// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //修改金币数
return await db.collection('user_jb').where({userId:event.userId}).update({
  data:{
    number:event.number
  }
})
}