// miniprogram/pages/goods/goods.js
const app = getApp();
Page({

  data: {
    nowType: 0,
    numbers: 0,
    numberOfThing: 0,
    numberOfChild: 0,
    goods: [],
    all: [],
    childs: [],
    things: [],
    hasGoods: false,
  },

  onShow: function (options) {
    if (!app.globalData.auth['scope.userInfo']){
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1000
      })

      return false;
    }
    this.refreshGoods();
  },

  changeType: function(e){
    let that = this;
    let newType = +e.currentTarget.dataset["type"];

    if (newType === 0){
      this.setData({
        nowType: newType,
        goods: that.data.all,
        hasGoods: that.data.all.length !== 0
      })
    }else if (newType === 1){
      this.setData({
        nowType: newType,
        goods: that.data.things,
        hasGoods: that.data.things.length !== 0
      })
    }else{
      this.setData({
        nowType: newType,
        goods: that.data.childs,
        hasGoods: that.data.childs.length !== 0
      })
    }
  },

  toDetail: function(options){
    let id = options.currentTarget.dataset["id"];
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?navigateType=1&id=' + id,
    })
  },

  handleSlideDelete: function(options){
    let that = this;
    let id = options.currentTarget.dataset["id"];
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function(res){
        if (res.confirm){
          let temp = null;
          for (let i = 0; i < that.data.all.length; i++) {
            if (that.data.all[i]["goods_id"] === id) {
              temp = that.data.all[i];
              break;
            }
          }

          if (temp.loseLabel === 1) {
            wx.showToast({
              title: '请先取消丢失状态',
              icon: 'none',
              duration: 1000
            })

            return false;
          }

          wx.showLoading({
            title: '删除中...',
          })

          wx.cloud.callFunction({
            name: "delete_good",
            data: {
              id: id,
              fileId: temp.fileId
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功',
              })
              that.refreshGoods();
            },
            fail: function (err) {
              wx.showToast({
                title: '删除失败，请检查你的网络设置',
                icon: 'none',
                duration: 1000
              })
              console.log("delete_good调用失败", err.errMsg)
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        }
      }
    })
  },

  refreshGoods: function(){
    let that = this;

    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
      name: 'get_user_goods',
      success: res => {
        let goods = res.result.data[0].goods;
        let things = [];
        let childs = [];

        goods = editTime(goods);
        goods.sort(function compare(val1, val2){
          return val2.loseLabel - val1.loseLabel
        })

        for (let i = 0; i < goods.length; i++) {
          if (goods[i].type === 0) {
            things.push(goods[i]);
          } else {
            childs.push(goods[i]);
          }
        }

        let number = goods.length;
        let numberOfThing = things.length;
        let numberOfChild = childs.length;

        if (that.data.nowType === 0) {
          that.setData({
            numbers: number,
            numberOfThing: numberOfThing,
            numberOfChild: numberOfChild,
            goods: goods,
            all: goods,
            childs: childs,
            things: things,
            hasGoods: goods.length !== 0
          })
        } else if (that.data.nowType === 1) {
          that.setData({
            numbers: number,
            numberOfThing: numberOfThing,
            numberOfChild: numberOfChild,
            goods: things,
            all: goods,
            childs: childs,
            things: things,
            hasGoods: things.length !== 0
          })
        } else {
          that.setData({
            numbers: number,
            numberOfThing: numberOfThing,
            numberOfChild: numberOfChild,
            goods: childs,
            all: goods,
            childs: childs,
            things: things,
            hasGoods: childs.length !== 0
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '拉取物品信息失败，请检查你的网络设置',
          icon: 'none',
          duration: 1000
        })
        console.log("get_user_goods调用失败", err.errMsg)
      },
      complete: function () {
        wx.hideLoading();
      }
    })

    function editTime(arr) {
      let now = new Date();
      for (let i = 0; i < arr.length; i++) {
        let time = new Date(arr[i].create_time);
        arr[i].create_time = parseInt(Math.abs(time.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }
      return arr;
    }
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
        if (res["Li_69X97-71jde4i78K4aOgGDeq3Z280edx_QsTC8gQ"] === "reject"){
          wx.showModal({
            title: '提示',
            content: '请允许授权发送订阅消息，便于在物品被找到时及时通知您',
            confirmText: '前往授权',
            success: function(res){
              if (res.confirm){
                wx.openSetting();
              }
            }
          })
        }else{
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