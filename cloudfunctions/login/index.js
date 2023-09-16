// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
  //引入md5加密密码
  const md5 = require('md5');
//数据库引用
const db = cloud.database(); 
//用户默认头像
let defaultImg = 'cloud://cloud1-0gystyilbb68bd45.636c-cloud1-0gystyilbb68bd45-1320793895/user_img/1：1图二.jpg'
// 云函数入口函数
exports.main = async (event, context) => {
  //根据用户名查询用户数据
  let userData = await db.collection('user').where({
    username: event.username
  }).get();
  //token
  let token = 'u' + Math.random().toString().slice(2) + new Date().getTime();
//密码加盐
let salt = 'tye5';

//对密码进行加盐, 加密密码
let password = md5(salt + event.password);

  if(userData.data.length === 0){
    //注册
    let user = await db.collection('user').add({
      data:{
        username:event.username,
        password,
        userimg:defaultImg
      }
    })

    if(user._id){
      //注册成功 
      //生成一个token保存保存在数据库
      await db.collection('login_status').add({
        data: {
          user_id: user._id,
          token
        }
      })
      return {msg: '注册并登录成功', userId: user._id, token, code: 1}
    }else{
      return {msg:'注册失败',code: 0}
    }
  }else{
    //校验密码
    if(password === userData.data[0].password){
      await db.collection('login_status').add({
        data: {
          user_id:  userData.data[0]._id,
          token
        }
      })

      return {mes:'登陆成功',code:1,token,userId:userData.data[0]._id}
    }else{
      return {mes:'密码错误',code:0}
    }

  }
}