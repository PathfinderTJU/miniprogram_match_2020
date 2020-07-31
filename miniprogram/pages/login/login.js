// miniprogram/pages/login/login.js
const app = getApp()

Page({

  data: {

  },

  toLogin: function() {
    // 判断是否授权过
    wx.getSetting({
      success: function(res) {        
        //已经授权过
        if (res.authSetting['scope.userInfo']) {
          //将授权结果写入app.js全局变量
          app.globalData.auth['scope.userInfo'] = true; //已经授权
          console.log("用户已授权")
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo;
              wx.showLoading({
                title: '获取授权信息中...',
              })
              wx.cloud.callFunction({
                name: 'get_set_userinfo',
                data: {
                  update: true,
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender
                },
                success: res => {
                  app.globalData.openId = res.result.openId
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                },
                fail: function(err){
                  wx.showToast({
                    title: '拉取授权信息失败，请检查你的网络状态',
                    duration: 1000,
                    icon: "none"
                  })
                  console.log("get_set_userinfo调用失败", err.errMsg)
                },
                complete: function(){
                  wx.hideLoading();
                }
              })
            },
            fail: function(err) {
              //失败回调函数
              wx.showToast({
                title: "更新用户信息失败，请检查你的网络状态",
                duration: 1000,
                icon: "none"
              });
              console.error("云函数get_userInfo调用失败", err.errMsg);
            }
          })
        } else {
          app.globalData.auth['scope.userInfo'] = false;
          console.log("用户未授权")
          wx.hideLoading();
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '拉取授权信息失败，请检查你的网络状态',
          duration: 1000,
          icon: "none"
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },

  toAdmin: function() {
    wx.navigateTo({
      url: '/pages/admin_login/admin_login',
    })
  }
})