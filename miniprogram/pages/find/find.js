// miniprogram/pages/find/find.js
const app = getApp();
Page({
  data: {
    hasLocation: false,
    goods: [],
    hasGoods: false,
    la: "",
    lo: ""
  },

  onShow: function (options) {
    let that = this;
    let now = new Date();
    wx.getLocation({
      success: function(res) {
        let location = res;

        wx.showLoading({
          title: '加载中',
        })

        wx.cloud.callFunction({
          name: "get_near_find_good",
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res){
            let goods = res.result.data;

            //计算时间
            let now = new Date();
            for (let i = 0 ; i < goods.length ; i++){
              let time = new Date(goods[i].loseTime);
              goods[i].loseTime = parseInt(Math.abs(time.getTime() - now.getTime()) / (1000 * 60))
            }
            
            that.setData({
              hasLocation: true,
              goods: goods,
              hasGoods: goods.length !== 0,
              la: location.latitude,
              lo: location.longitude
            })
          },
          fail: function(err){
            that.setData({
              hasLocation: true
            })
            wx.showToast({
              title: "获取物品信息失败，请检查你的网络状态",
              duration: 1000,
              icon: "none"
            });
            console.error("云函数ger_near_find_goods调用失败", err.errMsg);
          },
          complete: function(){
            wx.hideLoading();
          }
        })
      },
      fail: function(){
        wx.showToast({
          title: '无法获取您的位置信息，请打开定位',
          icon: 'none'
        })
      }
    })
  },

  toDetail: function(e){
    let id = e.currentTarget.dataset.id;
    //参数：_id、经纬度
    wx.navigateTo({
      url: '/pages/find_detail/find_detail?id=' + id + "&la=" + this.data.la + "&lo=" + this.data.lo,
    })
  },

  toAdd: function(){
    if (!app.globalData.auth['scope.userInfo']) {
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1000
      })

      return false;
    }

    //请求模板消息授权
    wx.requestSubscribeMessage({
      tmplIds: ["Li_69X97-71jde4i78K4aOgGDeq3Z280edx_QsTC8gQ"],
      success: function (res) {
        if (res["Li_69X97-71jde4i78K4aOgGDeq3Z280edx_QsTC8gQ"] === "reject") {
          wx.showModal({
            title: '提示',
            content: '请允许授权发送订阅消息，便于在物品被找到时及时通知您',
            confirmText: '前往授权',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/good_detail/good_detail?navigateType=0',
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})