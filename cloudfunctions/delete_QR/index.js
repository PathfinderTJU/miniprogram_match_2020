// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//cloud://test-260nv.7465-test-260nv-1302190356/0.jpg
// 云函数入口函数
exports.main = async (event, context) => {
  let fileId = event.fileId;

  return await cloud.deleteFile({
    fileList: [fileId]
  })
}