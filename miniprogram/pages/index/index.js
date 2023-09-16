// pages/index/index.js
const isLogin = require('../../vaild/vaild')
import Toast from '@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  onOpen(event) {
    const { position, name } = event.detail;
    switch (position) {
      case 'left':
        Notify({
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
      case 'right':
        Notify({
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
    }
  },
async begin(){
      // console.log('开始');
      //校验登录
      let login = await isLogin();
      console.log(login);
      if (login.result.isLogin) {
        //跳转关卡页面
        wx.navigateTo({
          url: '../checkpoint/checkpoint'
        })

      } else {
        //跳转到登录页面
        wx.navigateTo({
          url: '../login/login'
        })
      }
    },
  //点击了去看视频
  goVideo(){
    Toast('该功能正在维护')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})