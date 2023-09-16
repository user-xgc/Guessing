// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      username: '',
      password: ''
    }
  },
  //输入框发生改变
  inputUserInfo(e) {
    let value = e.detail.value;
    let key = e.currentTarget.dataset.key;
    this.data.userInfo[key] = value;
  },
  //点击登录
  login(){
    // console.log('userInfo==>',this.data.userInfo);
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'login',
      data:{
        ...this.data.userInfo
      }
    }).then(res => {
      console.log('res==>',res);
      wx.hideLoading();
      if(res.result.code === 1){
        //保存token和用户id到存储 
        wx.setStorageSync('token',res.result.token);
        wx.setStorageSync('userId',res.result.userId);
        //跳转至首页
        wx.switchTab({
          url: '../index/index',
        })
      }
    }).catch(err => {
      console.log('err==>',err);
      wx.hideLoading();
    })
  },
  
})