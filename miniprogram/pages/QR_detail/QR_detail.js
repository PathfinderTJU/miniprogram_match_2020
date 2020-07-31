// miniprogram/pages/QR_detail/QR_detail.js
Page({

  data: {
    name: "",
    url: "",
    time: 0,
    describtion: "",
    contact: "",
    id: "",
    openId: ""
  },

  onLoad: function (options) {
    let that = this;
    let id = options.scene;

    wx.showLoading({
      title: '获取中',
    })

    wx.cloud.callFunction({
      name: "get_lose_good",
      data: {
        id: id
      },
      success: function(res){
        let good = res.result.data[0];
        //计算时间
        let now = new Date();
        let time = new Date(good.loseTime);
        let temp = parseInt(Math.abs(time.getTime() - now.getTime()) / (1000 * 60))
       
        that.setData({
          name: good.goodsName,
          url: good.goodsUrl,
          time: temp,
          describtion: good.goodsInfo,
          contact: good.contact,
          id: id,
          openId: good.openId
        })
      },
      fail: function(err){
        wx.showToast({
          title: '获取物品内容失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        console.log("get_find_good_by_id云函数调用失败", err.errMsg)
      },
      complete: function(){
        wx.hideLoading();
      }
    })
    
  },

  home: function(){
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },

  toMessage: function(){
    wx.navigateTo({
      url: '/pages/message/message?name=' + this.data.name + "&openId=" + this.data.openId,
    })
  }
})