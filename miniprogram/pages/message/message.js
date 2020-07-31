// miniprogram/pages/message/message.js
Page({

  data: {
    id: "",
    location: "",
    name: "",
    openId: ""
  },

  onLoad: function (options) {
    console.log(options);
    let id = options.id;
    this.setData({
      id: id,
      name: options.name,
      openId: options.openId
    })
  },

  choose_location: function(){
    let that = this;
    wx.chooseLocation({
      success: function(res){
        let location = res.name
        if (location.length > 20){
          location = location.substring(0, 19)
        }
        that.setData({
          location: location
        })
      },
      fail: function(err){
        wx.showModal({
          title: '错误',
          content: '未能获取到位置信息，请进行位置授权并打开定位',
          confirmText: '前往授权',
          cancelText: '确定',
          success: function(res){
            if (res.confirm){
              wx.openSetting()
            }
          }
        })
        console.log(err)
      }
    })
  },

  submit: function(e){
    let that = this;
    let formData = e.detail.value;
    if (formData.name === ""){
      wx.showToast({
        title: '请输入您的称呼',
        icon: 'none'
      })

      return false;
    }

    if (this.data.location === ""){
      wx.showToast({
        title: '请选择丢失位置',
        icon: 'none'
      })

      return false;
    }

    let regNumber = /\d+/;
    if (regNumber.test(formData.name)){
      wx.showToast({
        title: '称呼不能包含数字',
        icon: 'none'
      })

      return false;
    }

    let now = new Date();
    let date = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 " + now.getHours() + ":" + now.getMinutes();
    
    wx.showModal({
      title: '提示',
      content: '将会给失主发送一条携带以上信息的留言',
      success: function(res){
        if (res.confirm){
          wx.showLoading({
            title: '发送中',
          })
          wx.cloud.callFunction({
            name: "subscribe_information",
            data: {
              goodsName: that.data.name,
              openId: that.data.openId,
              name: formData.name,
              location: that.data.location,
              date: date
            },
            success: function(res){
              wx.hideLoading();
              wx.showToast({
                title: '发送成功',
              })
              wx.navigateBack({
                delta: 1
              })
            },
            fail: function(err){
              wx.hideLoading();
              wx.showToast({
                title: '已经有人发送过留言~请尝试直接联系失主',
                icon: 'none',
                duration: 2000
              })
              console.log(err.errMsg);
            }
          })
        }
      }
    })
  }
})