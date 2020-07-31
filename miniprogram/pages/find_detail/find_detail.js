// miniprogram/pages/find_detail/find_detail.js
Page({

  data: {
    name: "",
    url: "",
    distance: 0,
    time: 0,
    describtion: ""
  },

  onLoad: function (options) {
    let that = this;
    let _id = options.id;
    let latitude = +options.la;
    let longitude = +options.lo;

    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
      name: "get_find_good_by_id",
      data: {
        id: _id
      },
      success: function(res){
        let good = res.result.data[0];

        //计算时间
        let now = new Date();
        let time = new Date(good.loseTime);
        let temp = parseInt(Math.abs(time.getTime() - now.getTime()) / (1000 * 60))        
        //计算距离
        let r = 6378;
        var rad1 = latitude * Math.PI / 180.0;
        var rad2 = good.location.coordinates[1] * Math.PI / 180.0; 
        var a = rad1 - rad2; 
        var b = longitude * Math.PI / 180.0 - good.location.coordinates[0] * Math.PI / 180.0;
        let location = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(2)
        that.setData({
          name: good.goodsName,
          url: good.goodsUrl,
          distance: location,
          time: temp,
          describtion: good.goodsInfo
        })
      },
      fail: function(err){
        wx.showToast({
          title: "获取物品信息失败，请检查你的网络状态",
          duration: 1000,
          icon: "none"
        });
        console.error("云函数ger_find_good_by_id调用失败", err.errMsg);
      },
      complete:function(){
        wx.hideLoading();
      }
    })    
  },

  back:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})