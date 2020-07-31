// miniprogram/pages/index/index.js
const app = getApp();
Page({

  data: {
    goods: [],
    hasGoods: false
  },

  onShow: function (options) {
    let that = this;
    
    if (!app.globalData.auth['scope.userInfo']) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1000
      })

      return false;
    }

    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: "get_user_goods",
      success:function(res){
        let goods = res.result.data[0].goods;

        goods.sort(function compare(val1, val2) {
          return val2.loseLabel - val1.loseLabel
        })

        if (goods.length > 5){
          goods = goods.relice(0, 5);
        }

        that.setData({
          goods: goods,
          hasGoods: goods.length !== 0
        })
      },
      fail: function(err){
        wx.showToast({
          title: '拉取物品信息失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        console.log("get_user_goods调用失败", err.errMsg)
      },
      complete: function(){
        wx.hideLoading();
      }
    })
  },

  toItem: function(e){
    let id = e.currentTarget.dataset["id"];
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?navigateType=1&id=' + id,
    })
  },

  toMore: function(){
    wx.switchTab({
      url: '/pages/goods/goods',
    })
  }
})