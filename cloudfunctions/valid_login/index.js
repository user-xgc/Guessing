// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let userLoginStatus = await db.collection('login_status').where({
    user_id: event.userId,
    token: event.token
  }).get()

  if (userLoginStatus.data.length === 0) {
    return {msg: '请先登录', code: 0, isLogin: false};
  } else {
    return {
      code: 1,
      isLogin: true
    }
  }
}