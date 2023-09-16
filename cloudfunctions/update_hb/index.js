// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //修改红包数
  return await db.collection('user_hb').where({userId:event.userId}).update({
    data:{
      number:event.number
    }
  })
}