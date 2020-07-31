// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-260nv'
})

const db = cloud.database({
  env: 'test-260nv'
});

const usergoods = db.collection("user_goods")
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID;
  let id = event.id;
  let fileId = event.fileId;

  await cloud.deleteFile({
    fileList: [fileId]
  })

  return await db.collection("user_goods").where({
    openId: openId
  }).update({
    data: {
      goods: _.pull({
        goods_id: id
      })
    }
  })
}