// miniprogram/pages/mine/mine.js
const app = getApp()
Page({

  data: {
    avatarUrl: "https://7465-test-260nv-1302190356.tcb.qcloud.la/default_logo.jpg?sign=78aeda03a4e8cbe1c234e540916f828d&t=1591020423",
    nickName: null,
    hasLog: false
  },

  onLoad: function (options) {
    if (app.globalData.auth['scope.userInfo']){
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        hasLog: true,
        nickName: app.globalData.userInfo.nickName,
      })
    }
  },

  getUserInfo: function(e){
    let that = this;
    //点击确认授权
    if (e.detail.errMsg === "getUserInfo:ok") {
      let userInfo = e.detail.userInfo;

      //显示loading
      wx.showLoading({
        title: '获取中',
      })

      //将userInfo上传至数据库，如果没有则新建，有则更新
      wx.cloud.callFunction({
        name: "get_set_userinfo",
        data: {
          getSelf: true,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender
        },
        success: function(res){
          console.log("授权成功");
          console.log(res);
          app.globalData.openId = res.result.openId;
          app.globalData.auth['scope.userInfo'] = true;
          that.setData({
            hasLog: true,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
          })
        },
        fail: function(err){
          wx.showToast({
            title: '登录失败，请检查你的网络设置',
            icon: 'none',
            duration: 1000
          })
          console.log("get_set_userinfo调用失败", err.errMsg)
        },
        complete: function(){
          wx.hideLoading();
        }
      })
    } else {
      console.log("用户拒绝了授权");
      wx.showToast({
        title: '拒绝授权将无法登录，请重新点击授权按钮',
        icon: 'none',
        duration: 1000
      })
    }
  },

  toAbout: function(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  toHelp: function(){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  }
})