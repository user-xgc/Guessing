// pages/my/my.js
const validLogin = require('../../vaild/vaild');
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    //兑换比例
    n1: 1000,
    hb: 0,
    jb: 0,
    show: false,
    show1: false,
    //兑换的红包
    dhb: 0,
    //供提现金额数据
    text: [0.5, 100, 200, 300, 400, 500],
    //金额高亮
    isActive: 0,
    //体现的金额
    j: 0.5,
    //总提现次数
    ktx: '',
    //已提现次数
    ytx: '',
    //用户总闯关数
    nowLev: '',
    //定义多少关可以增加一次体现机会
    n: 5,
    //各个阶段已经提下否
    isT:['0','0','0','0','0','0']
  },
  //点击兑换现金
  clickDui() {
    let dhb = this.data.jb / this.data.n1
    this.setData({
      show: true,
      dhb
    })
  },
  //兑换现金点击确定
  userOk() {
    let hb = this.data.dhb + this.data.hb
    let userId = wx.getStorageSync('userId')
    this.setData({
      jb: 0,
      hb,
    })
    //更新红包数据
    wx.cloud.callFunction({
      name: "update_hb",
      data: {
        userId,
        number: hb
      }
    }).then(res => {
      console.log('更新红包数据res==>', res);
    }).catch(err => {
      console.log('更新红包数据err==>', err);
    })
    //更新金币数据
    wx.cloud.callFunction({
      name: "update_jb",
      data: {
        userId,
        number: 0
      }
    }).then(res => {
      console.log('更新金币数据res==>', res);
    }).catch(err => {
      console.log('更新金币数据err==>', err);
    })
    Toast('兑换成功')
  },
  //兑换现金点击取消
  onClose() {
    Toast('已取消兑换')
  },
  //选择额点击提现
  clickBigT() {
    console.log(this.data.ktx, this.data.ytx, this.data.j, this.data.hb);
    //判断提现金额是否超出总金额
    if (this.data.j < this.data.hb) {
      console.log('有钱');
      //判断是否有次数
      if (this.data.ktx > this.data.ytx) {
        console.log('有次数');
        //判断该金额是否已经提现过
        let i = this.data.text.indexOf(this.data.j)
        console.log('this.data.isT[i]==>',this.data.isT[i]);
        if(this.data.isT[i] == 0){
          console.log('该金额没有提现过次数');
           this.setData({
          show1: true
        })
        }else{
          Toast("该金额已经提现过、试试其他金额吧")
        }
       
      } else {
        Toast("可提现次数不足")
        console.log('次数不足');
      }
    } else {
      Toast("金额不足、去看视频或闯关赚金币吧")
      console.log('金额不足');
    }
  },
  //体现弹出框确认
  userOk1() {
    console.log('确定体现');
    let userId = wx.getStorageSync('userId')
    let number = (this.data.hb - this.data.j).toFixed(2)
    //修改用户现金数据
    wx.cloud.callFunction({
      name: "update_hb",
      data: {
        userId,
        number
      }
    }).then(res => {
      console.log('提现后修改用户现金数据res==>', res);
      if (res.result.stats.updated == 1) {
        this.setData({
          hb: number
        })
        Toast('提现成功')
        let ytx = this.data.ytx + 1
        console.log('ytx==>', ytx, userId);
        //修改已经提现次数
        wx.cloud.callFunction({
          name: "update_ytx",
          data: {
            userId,
            ytx
          }
        }).then(res => {
          console.log('修改已经提现次数res==>', res);
          if (res.result.stats.updated == 1) {
            this.setData({
              ytx
            })
          }
        }).catch(err => {
          console.log('修改已经提现次数err==>', err);
        })
      }
    }).catch(err => {
      console.log('提现后修改用户现金数据err==>', err);
    })
    //修改用户当前金额已经提现过
    let i = this.data.text.indexOf(this.data.j)
    this.data.isT[i] = 1
    let isT = this.data.isT
    console.log('修改后的各个阶段提现==>',isT);
    wx.cloud.callFunction({
      name:'update_user_txje',
      data:{
        userId,
        isT
      }
    }).then(res=>{
      console.log('修改用户当前金额已经提现过res==>',res);
      if(res.result.stats.updated == 1){
        this.setData({
          isT
        })
      }
    }).catch(err=>{
      console.log('修改用户当前金额已经提现过err==>',err);
    })
  },
  //体现弹出框取消
  onClose1() {
    Toast('取消提现')
    console.log('取消体现');
  },
  //点击金额
  clickPrice(e) {
    let j = e.currentTarget.dataset.value
    let isActive = e.currentTarget.dataset.index
    this.setData({
      j,
      isActive
    })
  },

  //退出登录
  back() {
    //修改用户登录状态
    wx.showLoading({
      title: '退出中...',
      mask: true
    })
    let userId = wx.getStorageSync('userId')
    let token = wx.getStorageSync('token')
    wx.cloud.callFunction({
      name: "update_user_login",
      data: {
        userId,
        token
      }
    }).then(res => {
      console.log('修改用户登录状态res==>', res);
      if (res.result.stats.removed == 1) {
        wx.hideLoading()
        wx.removeStorageSync('userId')
        wx.removeStorageSync('token')
        this.fn()
      }
    }).catch(err => {
      console.log('修改用户登录状态err==>', err);
      wx.hideLoading()
    })
  },

  async fn() {
    let login = await validLogin()
    console.log(login);

    if (login.result.isLogin) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      //获取当前用户信息
      let userId = wx.getStorageSync('userId')
      //获取当前用户各个金额是否已经提现过
      wx.cloud.callFunction({
        name: 'get_user_txje',
        data: {
          userId,
        }
      }).then(res => {
        console.log('获取当前用户各个金额是否已经提现过res', res);
        if (res.result.data.length == 0) {
          console.log('无');
          //新增一个用户各个阶段是否已经体现
          wx.cloud.callFunction({
            name:"add_user_txje",
            data:{
              userId,
              isT:['0','0','0','0','0','0']
            }
          }).then(res=>{
            console.log('新增一个用户各个阶段是否已经体现res==>',res);
            return
          }).catch(err=>{
            console.log('新增一个用户各个阶段是否已经体现err==>',err);
          })
        }
        let isT = res.result.data[0].isT
        this.setData({
          isT
        })
      }).catch(err => {
        console.log('获取当前用户各个金额是否已经提现过err', err);
      })
      wx.cloud.callFunction({
        name: 'get_user',
        data: {
          userId
        }
      }).then(res => {
        this.setData({
          user: res.result.data[0]
        })
      }).catch(err => {
        console.log('err==>', err);
      })
      //获取当前用户金币数量
      wx.cloud.callFunction({
        name: 'get_jb',
        data: {
          userId
        }
      }).then(res => {
        this.setData({
          jb: res.result.data[0].number
        })
        // console.log('res==>',res.result.data[0].number);
      }).catch(err => {
        console.log('err==>', err);
      })
      //获取当前用户现金数量
      wx.cloud.callFunction({
        name: 'get_hb',
        data: {
          userId
        }
      }).then(res => {
        console.log('用户现金数量res==>', res);
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
        console.log('用户现金数量err==>', err);
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
      //获取当前用户已经闯关数
      wx.cloud.callFunction({
        name: "get_complete_level",
        data: {
          userId
        }
      }).then(res => {
        console.log('用户已经闯关数res==>', res);
        let nowLev = res.result.data[0].number
        this.setData({
          nowLev
        })
        console.log('nowLev==>', nowLev);
      }).catch(err => {
        console.log('用户已经闯关数err==>', err);
      })

      //更新当前用户可提现次数
      setTimeout(() => {
        let ktx = Math.floor(this.data.nowLev / this.data.n)
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
      }, 1000);
    } else {
      console.log('没登录');
      //跳转到登录页面
      wx.showLoading({
        title: '请先登录...',
        mask: true
      })
      setTimeout(() => {
        wx.hideLoading();
      }, 800);
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
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