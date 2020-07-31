// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true, //跟踪调用云函数的用户
  env: 'test-260nv' //环境名称
})

const db = cloud.database({ //获取云数据库
  env: 'test-260nv'
});

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: wx.base64ToArrayBuffer(event.value)
      }
    })

    return res;
  } catch (err) {
    return err;
  }
}