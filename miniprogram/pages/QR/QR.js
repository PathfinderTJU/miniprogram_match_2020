// miniprogram/pages/QR/QR.js
Page({
    data: {
        id: "",
        fileId: "",
        width: 0,
        fileUrl: "",
        hasScope: false
    },

    onLoad: function(options) {
        console.log(options)
        let that = this;
        let id = options.id;
        wx.getSystemInfo({
            success: function(res) {
                let screenWidth = res.screenWidth;
                let width = (screenWidth / 750) * 630;


                that.setData({
                    id: id,
                    width: width
                })
            },
        })
    },

    onUnload: function() {
        let that = this;
        if (that.data.fileId === "") {
            return false;
        }
        wx.cloud.callFunction({
            name: "delete_QR",
            data: {
                fileId: that.data.fileId
            },
            success: function(res) {
                console.log(res)
            }
        })
    },

    generate: function() {
        let that = this;
        if (that.data.fileId !== "") {
            wx.showToast({
                title: '请勿重复生成',
                icon: 'none',
                duration: 1000
            })
            return false;
        }
        wx.showLoading({
            title: '获取中',
        })

        wx.cloud.callFunction({
            name: "create_QR",
            data: {
                scene: that.data.id,
                page: "pages/QR_detail/QR_detail",
                width: that.data.width
            },
            success: function(res) {
                console.log(res);
                let fileId = res.result[0].fileID
                let fileUrl = res.result[0].tempFileURL
                that.setData({
                    fileId: fileId,
                    fileUrl: fileUrl
                })
                wx.hideLoading();
                wx.showToast({
                    title: '请长按图片保存',
                    icon: 'none',
                    duration: 1000
                })
            },
            fail: function(err) {
                wx.showToast({
                    title: '获取二维码失败，请检查你的网络设置',
                    icon: 'none',
                    duration: 1000
                })
                console.log("create_QR云函数调用失败", err.errMsg)
                wx.hideLoading();
            }
        })
    },

    preview: function() {
        let that = this;
        wx.previewImage({
            urls: [that.data.fileId],
        })
    }
})