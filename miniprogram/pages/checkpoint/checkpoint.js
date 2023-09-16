// pages/checkpoint/checkpoint.js
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //总关卡
    level_num:'',
    //已过关的关卡数量
    completed_lev:'',
  },
//首页
goHome(){
  wx.switchTab({
    url: '/pages/index/index'
  })
},
  //点击未解锁关卡
  clickWjs(){
    Toast('请先通过前面的关卡')
    console.log('点击了未解锁');
    // Toast("9999");
  },
  //点击了通过的关卡
  clickTg(e){
    console.log("通过==>",e.target.dataset.num);
    let number = e.target.dataset.num
    //跳转关卡页面
    wx.navigateTo({
      url: `../leve/leve?num=${number}&text=${this.data.completed_lev}`
    })
  },
  //点击当前关卡
  play(){
  let number = Number(this.data.completed_lev)+1
  
  //跳转关卡页面
  wx.navigateTo({
    url: `../leve/leve?num=${number}&text=${this.data.completed_lev}`
  })
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let userId = wx.getStorageSync('userId');
    //获取关卡谜语数据
    wx.cloud.callFunction({
      name:'get_riddle_list'
    }).then(res=>{
      // console.log('res==>',res);
      this.setData({
        level_num:res.result.data
      })
    }).catch(err=>{
      console.log('err==>',err);
    })
    //获取用户已通过关卡数据
    wx.cloud.callFunction({
      name:'get_complete_level',
      data:{
        userId
      }
    }).then(res=>{
      console.log('获取用户已通过关卡数据res==>',res);
      if(res.result.data.length == 0 ){
        //增加用户已经闯关总数
        wx.cloud.callFunction({
          name:'add_component_level',
          data:{
            userId,
            number:0
          }
        }).then(res=>{
          console.log('增加用户已经闯关总数res==>',res);
        }).catch(err=>{
          console.log('增加用户已经闯关总数err==>',err);
        })
        wx.hideLoading();
        return
      }
      this.setData({
        completed_lev:Number(res.result.data[0].number)
      })
      wx.hideLoading();
      // if(res.result.data.length===0){
      //   console.log(userId);
      //   wx.cloud.callFunction({
      //     name:'add_component_level',
      //     data:{
      //       userId,
      //     number:'0'
      //     }
          
      //   }).then(res=>{
      //     console.log('res==>',res);
      //   }).catch(err=>{
      //     console.log('err==>',err);
      //   })
      // }
    }).catch(err=>{
      wx.hideLoading();
      console.log('获取用户已通过关卡数据err==>',err);
    })
  },
})