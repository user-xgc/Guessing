// pages/task/task.js
const validLogin = require('../../vaild/vaild');
const utils = require('../../utils/utils');
import Toast from '@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //今日签到是否已经签到
    isQ:0,
    //已经签到天数
    qNum:0,
    //总提现次数
    ktx:0,
    //已经提现次数
    ytx:0,
    //定义多少关可以增加一次体现机会(与我的页面一至)
    n:5,
    //猜谜已领取
    cmLq: [],
    //每日已领取
    mrLq: [],
    //每日已领取
    //当前红包数
    hb: 0,
    //当前金币数
    jb: 0,
    //猜谜高亮
    cm: 1,
    //每日高亮
    mr: 0,
    //显示签到
    qd: 0,
    //显示体现
    tx: 1,
    //已经闯关数
    nu: 0,
    //今日已经闯关数
    number: 0,
    //签到金币数
    jbQd:[100,150,200,250,'抽金币'],
    //签到的5天的奖励
    a:0,
    //猜歌任务数据
    cgText: [{
        //标题
        title: 1,
        //完成状态
        //完成1已经领取2未完成0
        init: 0,
        //红包金额
        price: 0.5,
        //已经完成数量
        number: 0,
      },
      {
        title: 3,
        init: 0,
        price: 0.5,
        number: 0,
      },
      {
        title: 5,
        init: 0,
        price: 1,
        number: 0,
      },
      {
        title:10,
        init: 0,
        price: 1,
        number: 0,
      },
      {
        title: 20,
        init: 0,
        price: 2.5,
        number: 0,
      },
      {
        title: 30,
        init: 0,
        price: 3,
        number: 0,
      }
    ],
    //每日任务
    mrText: [
      // {
      //   //标题
      //   title:'每日登录',
      //   //完成状态
      //   //完成1已经领取2未完成0
      //   init:0,
      //   //金币金额
      //   price:100,
      //   //已经完成数量
      //   number:0,
      //   //总数量
      //   n:0,
      // },
      {
        title: '答对 5 题',
        init: 0,
        price: 50,
        number: 0,
        n: 5,
      },
      {
        title: '答对 10 题',
        init: 0,
        price: 100,
        number: 0,
        n: 10,
      },
      {
        title: '答对 20 题',
        init: 0,
        price: 200,
        number: 0,
        n: 20,
      },
      {
        title: '答对 30 题',
        init: 0,
        price: 300,
        number: 0,
        n: 30,
      },
      {
        title: '答对 40 题',
        init: 0,
        price: 400,
        number: 0,
        n: 40,
      },
      {
        title: '答对 50 题',
        init: 0,
        price: 500,
        number: 0,
        n: 50,
      },
    ]
  },
  //点击每日任务
  clickDay() {
    this.setData({
      mr: 1,
      cm: 0,
      qd: 1,
      tx: 0,
    })
  },
  //点击财迷任务
  clickCm() {
    this.setData({
      mr: 0,
      cm: 1,
      qd: 0,
      tx: 1,
    })
  },
  //点击领取未完成和已经领取
  clickBtn(e) {
    let index = e.target.dataset.index
    let type = e.target.dataset.type
    let n = e.target.dataset.value
    let userId = wx.getStorageSync('userId')
    if (n == 1) {
      console.log('可以领取',type,index);
      
      if(type == 0){
        //修改每日任务领取情况
        let mr =  [...this.data.mrLq,index];
        let date = utils.formatDate(new Date());
        console.log('mr==>',mr);
        wx.cloud.callFunction({
          name:'update_user_lq',
          data:{
            userId,
            date,
            mr
          }
        }).then(res=>{
          console.log('修改每日任务领取情况res==>',res);
          if(res.result.stats.updated==1){
            //图标变为已领取
            this.data.mrText[index].init = 2
            this.setData({
              mrText:this.data.mrText
            })
            //
          }
        }).catch(err=>{
          console.log('修改每日任务领取情况err==>',err);
        })
        let p =  this.data.mrText[index].price
       let number = p + this.data.jb
        //修改金币余额
        wx.cloud.callFunction({
          name:'update_jb',
          data:{
            date,
            userId,
            number
          }
        }).then(res=>{
          console.log('修改金币金额res==>',res);
          if(res.result.stats.updated==1){
            this.setData({
              jb:number
            })
          }
        }).catch(err=>{
          console.log('修改金币金额err==>',err);
        })
        Toast(`领取成功,获得金币*${p}`)
      }else{
        //修改财迷任务领取情况
       let cm =  [...this.data.cmLq,index]
       console.log('cm==>',cm);
        wx.cloud.callFunction({
          name:'update_user_lq_cm',
          data:{
            userId,
            cm
          }
        }).then(res=>{
          console.log('修改财迷任务领取情况res==>',res);
          if(res.result.stats.updated==1){
            //图标变为已领取
            this.data.cgText[index].init = 2
            this.setData({
              cgText:this.data.cgText
            })
            //
          }
        }).catch(err=>{
          console.log('修改财迷任务领取情况err==>',err);
        })
       let n =  this.data.cgText[index].price
       let number = n + this.data.hb
       console.log('红包',number);
        // 修改红包金额
        wx.cloud.callFunction({
          name:'update_hb',
          data:{
            userId,
            number
          }
        }).then(res=>{
          console.log('修改红包金额res==>',res);
          if(res.result.stats.updated==1){
            this.setData({
              hb:number
            })
            Toast(`领取成功,活动红包*${n}`)
          }
        }).catch(err=>{
          console.log('修改红包金额err==>',err);
        })
      }
      // Toast('领取成功');
    } else if (n == 0) {
      Toast('任务未完成');
      console.log('任务未完成');
    } else {
      Toast('已经领取了');
      console.log('已经领取了');
    }
  },
  //点击提现
  clickT() {
    console.log('点击了提现');
    //判断是否有提现次数
    if(this.data.hb!=0){
      console.log('有钱');
      if(this.data.ktx > this.data.ytx){
        console.log('可提现');
        Toast('可提现，正在跳转至首页')
        //跳转至首页
        wx.switchTab({
          url: '/pages/my/my'
        })
      }else{
        Toast('可提现次数不足')
      }
    }else{
      Toast('金额不足')
    }
    //跳转至我的页面选择金额
  },
  //签到
  clickGet(){
    if(this.data.isQ == 0){
      console.log('未签到，可以领取');
      let userId = wx.getStorageSync('userId')
      let date = utils.formatDate(new Date());
      let i = this.data.qNum%5
      console.log('i==>',i);
     let a =  this.data.jbQd[i]
     console.log('a==>',a);
     if(i!=4){
       //修改金币数量
       let number = this.data.jb + a
       console.log('number==>',number);
       wx.cloud.callFunction({
         name:"update_jb",
         data:{
           userId,
           number
         }
       }).then(res=>{
         console.log('修改金币数量res==>',res);
        if(res.result.stats.updated == 1){
          this.setData({
            jb:number,
          })
          Toast(`恭喜获得金币*${a}`)
        }
       }).catch(err=>{
        console.log('修改金币数量err==>',err);
      })
      console.log('签到成功');
     }else{
       //修改红报金额
       let a = Number((Math.random()*2).toFixed(2))
       let number  = (Number(this.data.hb) + a).toFixed(2)
       console.log('number=====',number);
       wx.cloud.callFunction({
         name:'update_hb',
         data:{
           userId,
           number
         }
       }).then(res=>{
         console.log('修改红报金额res==>',res);
         if(res.result.stats.updated == 1){
           this.setData({
             hb:number
           })
           Toast(`恭喜获得红包*${a}`)
         }
         console.log('this.data.a==>',this.data.a);
       }).catch(err=>{
        console.log('修改红报金额err==>',err);
      })
     }
            //签到天数加一
            let number1 = this.data.qNum + 1
            console.log('number===>',number1);
            wx.cloud.callFunction({
              name:'update_user_qd',
              data:{
                userId,
                number:number1
              }
            }).then(res=>{
              console.log('签到天数加一res==>',res);
              if(res.result.stats.updated == 1){
                this.setData({
                  qNum:number1
                })
              }
            }).catch(err=>{
             console.log('签到天数加一err==>',err);
           })
            //修改今日已经签到
            wx.cloud.callFunction({
              name:'update_user_day_qd',
              data:{
                userId,
                date,
                number:1
              }
            }).then(res=>{
              console.log('修改今日已经签到res===>',res);
              if(res.result.stats.updated == 1){
                this.setData({
                  isQ:1
                })
              }
            }).catch(err=>{
             console.log('修改今日已经签到err===>',err);
           })
          
    }else{
      Toast('已经签到,明天再来吧')
      console.log('已经签到，不可领取');
    }
  },

async fn(){
  let login = await validLogin();
  console.log(login);
  if (login.result.isLogin) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //获取用户id
    let userId = wx.getStorageSync('userId')
    //获取当前日期
    let date = utils.formatDate(new Date());
    console.log('currentDate ==> ', date);
  //获取总签到天数
  wx.cloud.callFunction({
    name:"get_user_qd",
    data:{
      userId
    }
  }).then(res=>{
    console.log('获取总签到天数res==>',res);
    if(res.result.data.length == 0){
      //增加一条签到数据
      wx.cloud.callFunction({
        name:'add_user_qd',
        data:{
          userId,
          number:0
        }
      }).then(res=>{
        console.log('增加一条签到数据res==>',res);
        
      }).catch(err=>{
        console.log('增加一条签到数据err==>',err);
      })
    }else{
      let qNum = res.result.data[0].number
      this.setData({
        qNum
      })
    }
    console.log('this.data.qNum==>',this.data.qNum);
  }).catch(err=>{
    console.log('获取总签到天数err==>',err);
  })
  //获取用户今日是否签到
  wx.cloud.callFunction({
    name:"get_user_day_qd",
    data:{
      date,
      userId
    }
  }).then(res=>{
    console.log('获取用户今日是否签到res==>',res);
    if(res.result.data.length == 0){
      //增加一条数据
      wx.cloud.callFunction({
        name:"add_user_day_qd",
        data:{
          date,
          userId,
          qd:0
        }
      }).then(res=>{
        console.log('增加用户今日是否签到res==>',res);
      }).catch(err=>{
        console.log('增加用户今日是否签到err==>',err);
      })
    }else{
      let isQ = res.result.data[0].qd
      this.setData({
        isQ
      })
    }
    console.log('this.data.isQ==>',this.data.isQ);
  }).catch(err=>{
    console.log('获取用户今日是否签到err==>',err);
  })
  
    //获取红包
    wx.cloud.callFunction({
      name: 'get_hb',
      data: {
        userId
      }
    }).then(res => {
      console.log('红包res==>', res);
      if (res.result.data.length == 0) {
        //增加一条数据
        wx.cloud.callFunction({
          name: 'add_hb',
          data: {
            userId,
            number: 0
          }
        }).then(res => {
          console.log('res==>', res);
        }).catch(err => {
          console.log('err==>', err);
        })
      }
  
      this.setData({
        hb: res.result.data[0].number
      })
    }).catch(err => {
      console.log('err==>', err);
    })
    //获取金币
    wx.cloud.callFunction({
      name: 'get_jb',
      data: {
        userId
      }
    }).then(res => {
      if (res.result.data.length == 0) {
        //增加一个用户金币数据
        wx.cloud.callFunction({
          name: 'add_jb',
          data: {
            userId,
            number: 0
          }
        }).then(res => {
          console.log('res==>', res);
        }).catch(err => {
          console.log('err==>', err);
        })
        return
      }
      this.setData({
        jb: res.result.data[0].number
      })
      // console.log('res==>',res.result.data[0].number);
    }).catch(err => {
      console.log('err==>', err);
    })
  //获取当前用户可提现次数
  wx.cloud.callFunction({
  name: 'get_tx',
  data: {
    userId
  }
  }).then(res => {
  console.log('当前用户可提现次数res==>', res);
  if (res.result.data.length == 0) {
    //增加体现先关数据
    wx.cloud.callFunction({
      name: "add_tx",
      data: {
        userId,
        ktx: 0,
        ytx: 0
      }
    }).then(res => {
      console.log('增加体现先关数据res==>', res);
    }).catch(err => {
      console.log('增加体现先关数据err==>', err);
    })
  }
  let ktx = res.result.data[0].ktx
  let ytx = res.result.data[0].ytx
  this.setData({
    ktx,
    ytx
  })
  console.log('ktx', this.data.ktx, 'ytx', this.data.ytx);
  }).catch(err => {
  console.log('err==>', err);
  })
    
  //获取已经闯关数
    wx.cloud.callFunction({
      name: 'get_complete_level',
      data: {
        userId
      }
    }).then(res => {
      console.log('已经闯关==>',res);
      let nu = res.result.data[0].number;
      this.setData({
        nu
      })
  
      this.data.cgText.map(item => {
        if (item.title > nu) {
          //获取是否已经领取
  
          return item.init = 0
        } else {
          return item.init = 1
        }
      })
      this.setData({
        cgText: this.data.cgText
      })
  
      console.log('this.data.cgText==>', this.data.cgText);
    }).catch(err => {
      console.log('err==>', err);
    })
  
  //更新当前用户可提现次数
  setTimeout(() => {
    let ktx =Math.floor(this.data.nu / this.data.n)
  wx.cloud.callFunction({
   name: 'update_tx',
   data: {
     userId,
     ktx
   }
  }).then(res => {
   console.log('更新当前用户可提现次数res==>', res);
   wx.hideLoading();
  }).catch(err => {
  wx.hideLoading();
   console.log('更新当前用户可提现次数err==>', err);
  })
  }, 800);
  //获取今日已经答对题数
    wx.cloud.callFunction({
      name: 'get_day_finish',
      data: {
        userId,
        date
      }
    }).then(res => {
      console.log('已经答对题数res==>', res);
      if (res.result.data.length == 0) {
        //增加一组今日已完成数量的数据
        wx.cloud.callFunction({
          name: 'add_day_finish',
          data: {
            userId,
            date,
            number: 0
          }
        }).then(res => {
          console.log('res==>', res);
        }).catch(err => {
          console.log('err==>', err);
        })
        return
      }
      let number = res.result.data[0].number
      this.setData({
        number
      })
      this.data.mrText.map(item => {
        if (item.n > number) {
          item.init = 0
          this.setData({
            mrText: this.data.mrText
          })
        } else {
          //判断那些领取了
          //如果未领取就执行下面的
          item.init = 1
          this.setData({
            mrText: this.data.mrText
          })
        }
      })
    }).catch(err => {
      console.log('err==>', err);
    })
  //获取已经领取的
  setTimeout(() => {
  //每日任务已领取
  wx.cloud.callFunction({
      name: 'get_user_lq',
      data: {
        date,
        userId
      }
    }).then(res => {
      console.log('已经领取res==>', res);
      if (res.result.data.length == 0) {
        //增加今日已经领取
        wx.cloud.callFunction({
          name: 'add_user_lq',
          data: {
            date,
            userId,
            mr: [],
          }
        }).then(res => {
          console.log('res==>', res);
        }).catch(err => {
          console.log('err==>', err);
        })
        return
      }
      let mr = res.result.data[0].mr
      let mrText = this.data.mrText
      
      mrText.map((item,index)=>{
        if(mr[index]!=undefined){
          console.log('进入到了mrText');
          return item.init = 2
        }
      })
      this.setData({
        mrLq: mr,
        mrText
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.log('err==>', err);
    })
    //整体猜谜任务已经领取
    wx.cloud.callFunction({
      name: 'get_user_lq_cm',
      data: {
        userId
      }
    }).then(res => {
      console.log('已经领取的猜谜任务res==>', res);
      if (res.result.data.length == 0) {
        //增加已经领取财迷任务
        wx.cloud.callFunction({
          name: 'add_user_lq_cm',
          data: {
            date,
            userId,
            cm: [],
          }
        }).then(res => {
          console.log('增加猜谜已经领取res==>', res);
        }).catch(err => {
          console.log('增加猜谜已经领取err==>', err);
        })
        return
      }
      let cm = res.result.data[0].cm
      let cgText = this.data.cgText
      
      cgText.map((item,index)=>{
        if(cm[index]!=undefined){
          console.log('进入到了cgText');
          return item.init = 2
        }
      })
      this.setData({
        cmLq: cm,
        cgText,
      })
      // console.log('cm情况==>',this.data.cmLq);
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.log('err==>', err);
    })
  }, 1000);
  }else{
    //跳转到登录页面
    wx.navigateTo({
      url: '../login/login'
    })
  }
 
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
    this.fn()
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