// pages/leve/leve.js
// import Dialog from '@vant/weapp/dialog/dialog';
const utils = require('../../utils/utils');
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //回答错误后扣除金币数量
    k:30,
    //关卡数
    level: '',
    //当前关卡数据
    lev_text: '',
    //答案选择数据
    dn_list: '',
    //选择的答案
    dn_level: [],
    //答案选择数据显示隐藏
    isActive: -1,
    //判断答案正确与否
    isShow: [false, false, false, false, false, false, false, false, false, false, false, false],
    //弹窗
    show: false,
    //当前已经通关数
    num: '',
    //是否显示增加金币
    jbShow: false,
    //是否为点击了选择的答案后再点击的答案列表
    isFirst: false,
    //点击的所选择答案的下标
    index: -1,
    //金币数量
    jb: 0,
    //提示一次需要扣除的数量
    ts: 60,
    //openid
    openid:'',
    //闯关成功奖励
    jbNumber:50,
    //今日已经完成关术
    levFin:0,
    //日期
    date:'',
    //
    a:[],
    // id:''
  },
  // 下一关
  userOk() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let num = (Number(this.data.level) + 1).toString()
    //获取下一关
    wx.cloud.callFunction({
      name: 'get_now_level',
      data: {
        gq: num
      }
    }).then(res => {
      // console.log('res==>',res.result.data);
      let arr = res.result.data[0].text
      let arr1 = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.setData({
        lev_text: res.result.data[0],
        dn_list: this.randomSortArray(arr),
        isTrue: 0,
        dn_level: [],
        isShow: arr1,
        level: Number(this.data.level) + 1
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.log('err==>', err);
    })
  },
  //选关
  onClose() {
    this.setData({
      show: false
    });
    //跳转至选择关卡页面
    wx.navigateTo({
      url: '../checkpoint/checkpoint'
    })
  },

  //数组随机排序
  randomSortArray(arr) {
    var stack = [];
    while (arr.length) {
      var index = parseInt(Math.random() * arr.length); // 利用数组长度生成随机索引值
      stack.push(arr[index]); // 将随机索引对应的数组元素添加到新的数组中
      arr.splice(index, 1); // 删除原数组中随机生成的元素
    }
    return stack;
  },
  //点击选择答案
  choice(e) {
    let val = e.currentTarget.dataset.value;
    // console.log(e);
    let index = e.currentTarget.dataset.index;
    let userId = wx.getStorageSync('userId');
    let dn_level = this.data.dn_level;
    let lev_text = this.data.lev_text
    //数据不超过答案长度
    if (dn_level.length < lev_text.md.length) {
      //修改所选
      let i = 0
      if (this.data.isFirst) {
        console.log("正在修改",this.data.a);
        // dn_level[this.data.a[i]] = val
        // i++
        // if(i>Number(this.data.a.length)){
        //   i=0
        // }
        console.log('index==>',index);
        this.data.isShow[index] = true
        dn_level[this.data.index] = val
        this.setData({
          dn_level,
          isFirst: false,
          isShow:this.data.isShow,
        })
        return
      }
      //所选不重复
      if (dn_level.indexOf(val) == -1) {

        //数据中有空数据
        if (dn_level.filter(item => item == '').length == 1) {
          let index1 = dn_level.indexOf("")
          console.log("有空数据");
          this.data.isShow[index] = true
          dn_level[index1] = val
          this.setData({
            dn_level,
            isShow:this.data.isShow
          })
          return
        }
        dn_level.push(val)
        console.log('正常选答案', index);
        this.data.isShow[index] = true
        this.setData({
          isActive: index,
          dn_level,
          isShow: this.data.isShow
        })
      }
      // this.data.isActive == index
    }
    if (dn_level.length == lev_text.md.length) {
      console.log('开始判断答案');
      console.log('正确答案==>', lev_text.md);
      console.log('我的答案==>', dn_level.join(''));
      let myDn = dn_level.join('');

      if (myDn == lev_text.md) {
        //答案正确
        this.setData({
          isTrue: 1,
        })
        console.log('答案正确');

        this.updateLevel(userId);

       //更新今日闯关
      let number1 = this.data.levFin +1
      console.log(number1);
      this.setData({
        levFin:number1
      })
      this.updateUserFinish(userId,this.data.date,number1)

      } else {
        console.log('答案错误');
        //扣除金币
        let number = this.data.jb - this.data.k
        console.log('number==>',number);
        wx.cloud.callFunction({
          name:'update_jb',
          data:{
            userId,
            number
          }
        }).then(res=>{
          console.log('扣除金币res==>',res);
        }).catch(err=>{
          console.log('扣除金币err==>',err);
        })
        if(number<0){
          number = 0;
          Toast('金币不足啦、看视频免费获取正确答案')
        }
        this.setData({
          isTrue: 2,
          jb:number
        })
        let arr = [false, false, false, false, false, false, false, false, false, false, false, false]
        setTimeout(() => {
          this.setData({
            isTrue: 0,
            dn_level: [],
            isShow: arr
          })
        }, 1000);
      }
    }
  },
  //点击回答的答案
  clickA(e) {
    let value = e.currentTarget.dataset.value;
    let index = e.currentTarget.dataset.index;
    console.log(index, value);
    //   console.log(this.data.dn_list.indexOf(value));
    let k = this.data.dn_list.indexOf(value);
    let i = this.data.dn_level.indexOf(value)
    this.data.dn_level[i] = ''
    this.data.isShow[k] = false;
let a = [...this.data.a,index]
console.log('this.lev_text==>',this.data.lev_text);

    this.setData({
      isFirst: true,
      index,
      isShow: this.data.isShow,
      dn_level: this.data.dn_level,
      a:[...this.data.a,index]
    })
  },
  //点击提示
  clickTs() {
    let jb = this.data.jb;
    let userId = wx.getStorageSync('userId');
    let ts = this.data.ts;
    console.log('点击了提示', jb);
    if (jb - ts > 0) {
      jb -= ts
      this.data.dn_level = [...this.data.lev_text.md]
      this.setData({
        jb,
        dn_level: this.data.dn_level,
        isTrue: 1,
      })
      let number = jb
      this.updateLevel(userId,number);
      //更新金币数据
      let jb1
      if (Number(this.data.num) < Number(this.data.level)){
        console.log('21211');
        jb1 = this.data.jb + this.data.jbNumber
        
      }else{
        jb1 = this.data.jb
      }
      console.log('jb1==>',jb1);
      wx.cloud.callFunction({
        name:'update_jb',
        data:{
          userId, 
          number:jb1
        }
      }).then(res=>{
        console.log('更新金币数据res==>',res);
      }).catch(err=>{
        console.log('err==>',err);
      })
      //更新今日闯关
      let number1 = this.data.levFin +1
      console.log(number1);
      this.setData({
        levFin:number1
      })
      this.updateUserFinish(userId,this.data.date,number1)
    } else {
      Toast("金币不足，看视频免费获取正确答案")
      console.log('金币不足');
    }
  },
  //点击视频提示
  clickVideo(){
    Toast('抱歉，暂无视频')
  },
  //求助
  clickHelp(){
    Toast("相信自己，再想想")
  },
  //修改关卡方法
  updateLevel(userId) {
    setTimeout(() => {
      this.setData({
        show: true
      });
    }, 1000);

    if (Number(this.data.num) < Number(this.data.level)) {
      let jb = this.data.jb + this.data.jbNumber
      setTimeout(() => {
        this.setData({
          jbShow: true,
          jb
        })
      }, 800);
      wx.cloud.callFunction({
        name:'update_jb',
        data:{
          userId, 
          number:jb
        }
      }).then(res=>{
        console.log('更新金币数据res==>',res);
      }).catch(err=>{
        console.log('err==>',err);
      })
      //更新当前用户通过关卡数
      console.log('更新后的关卡数==>', this.data.level, userId);
      wx.cloud.callFunction({
        name: 'update_complete_level',
        data: {
          number: this.data.level,
          userId
        }
      }).then(res => {
        console.log('更新关卡数据==>', res);
      }).catch(err => {
        console.log('云函数调用失败==>', err);
      })
    } else {
      //不显示增加金币
      this.setData({
        jbShow: false
      })
    }
  },
  //修改用户今日已经完成提数次数
  updateUserFinish(userId,date,number1){
    wx.cloud.callFunction({
      name:"update_day_finish",
      data:{
        userId,
        date,
        number:number1,
      }
    }).then(res=>{
      console.log('更新今日闯关res==>',res);
    }).catch(err=>{
      console.log('更新今日闯关err==>',err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取openid
    wx.cloud.callFunction({
      name:'get_optionid',
      data:{
        message:'helloCloud',
      }
    }).then(res=>{
      let openid = res.result.openid
      console.log('258res==>',openid)//res就将appid和openid返回了
      this.setData({
        openid
      })
    })

    let userId = wx.getStorageSync('userId');
    //获取当前日期
    let date = utils.formatDate(new Date());

    this.setData({
      level: options.num,
      num: options.text,
      date
    })
    //获取当前关卡
    console.log(options);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'get_now_level',
      data: {
        gq: options.num
      }
    }).then(res => {
      // console.log('res==>',res.result.data[0]);
      let arr = res.result.data[0].text
      this.setData({
        lev_text: res.result.data[0],
        dn_list: this.randomSortArray(arr)
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      console.log('err==>', err);
    })
    //获取用户金币数据
    wx.cloud.callFunction({
      name: 'get_jb',
      data: {
        userId
      }
    }).then(res => {
      console.log('res==>', res);
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
    }).catch(err => {
      console.log('err==>', err);
    })
    //获取用户今日已经猜谜成功次数
  wx.cloud.callFunction({
    name:'get_day_finish',
    data:{
      date,
      userId
    }
  }).then(res=>{
    console.log('今日已完成提数res==>',res.result.data[0].number);
    let levFin = res.result.data[0].number
    // let id = res.result.data[0]._id
    this.setData({
      levFin,
      // id
    })
  }).catch(err=>{
    console.log('今日已完成提数err==>',err);
  })
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