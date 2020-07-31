// miniprogram/pages/good_detail/good_detail.js
const default_img = "https://7465-test-260nv-1302190356.tcb.qcloud.la/default_logo.jpg?sign=03edf42daf1c025eaf58fc751537bae8&t=1590632778";
Page({

  data: {
    navigateType: null,
    name: "",
    goods_id: "",
    url: default_img,
    type: 0,
    lose: false,
    contact: "",
    describtion: "",
    types: ["物品", "孩童"],
    create_time: null
  },

  onLoad: function (options) {
    let that = this;
    let navigateType = +options.navigateType;
    if (navigateType === 0){//新建
      this.setData({
        navigateType: 0
      })
    }else{//修改已有
      let id = options.id;
      //根据openid和id获取这个物品信息
      wx.showLoading({
        title: '加载中',
      })

      wx.cloud.callFunction({
        name: "get_user_good_by_id",
        data: {
          id: id
        },
        success: function(res){
          console.log(res)
        },
        fail: function(err){
          wx.showToast({
            title: "获取物品信息失败，请检查你的网络状态",
            duration: 1000,
            icon: "none"
          });
          console.log("云函数ger_user_good_by_id调用失败", err.errMsg);
        },
        complete: function(){
          wx.hideLoading();
        }
      })
      that.setData({
        navigateType: 1
      })
    }
  },

  changeType: function(e){
    let newType = +e.detail.value;
    this.setData({
      type: newType
    })
  },

  submit: function(e){
    let formData = e.detail.value;
    console.log(formData);
    console.log(this.data)
    //名称、联系方式、描述信息进行合法化检查



    let newGood = {};
    newGood.type = formData.type;
    newGood.goodsName = formData.name;
    newGood.loseLabel = +formData.status;
    if (this.data.navigateType === 0){
      //新建物品，参数为newGood，属性见命名方法，location为【经度，纬度】数组，需要在云平台中使用Geopoint转换为地理位置对象
      newGood
    }else{
      //更新物品，区分标识为openid+create_time(Y-M-D)
    }
  },

  toQR:function(e){
    wx.redirectTo({
      url: '/pages/QR/QR?id=' + this.data.goods_id,
    })
  },

  addImage: function(e){
    let that = this;
    wx.showToast({
      title: '建议选择4M以下正常照片尺寸的图片',
      icon: 'none',
      duration: 2000
    })
    if (this.data.url !== default_img){
      wx.showModal({
        title: '提示',
        content: '将要替换图片，是否继续',
        success: function(res){
          if (res.confirm){
            chooseImg();
          }else{
            return false;
          }
        }
      })
    }else{
      chooseImg();
    }

    function chooseImg(){
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: function (res) {
          let tempUrl = res.tempFilePaths[0];
          wx.showLoading({
            title: '图片审核中...',
          })
          wx.compressImage({
            src: tempUrl,
            quality: 1,
            success: function(res){
              wx.getFileSystemManager().readFile({
                filePath: res.tempFilePath,
                success: function(res){
                  let value = wx.arrayBufferToBase64(res.data)
                  if (value.length > 50000){
                    wx.hideLoading();
                    wx.showToast({
                      title: '图片大小过大或尺寸过大，请更换图片',
                      icon: 'none',
                      duration: 2000
                    })
                    return false;
                  }

                  wx.cloud.callFunction({
                    name: "img_check",
                    data: {
                      value: wx.arrayBufferToBase64(res.data)
                    },
                    success: res => {
                      if (res.result.errCode === 87014) {
                        wx.showToast({
                          title: '审核未通过，请更换图片',
                          icon: 'none',
                          duration: 2000
                        })
                      } else {
                        that.setData({
                          url: tempUrl
                        })
                      }
                      wx.hideLoading();
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  }
})