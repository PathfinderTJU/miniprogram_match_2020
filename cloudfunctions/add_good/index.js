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
  let good = event.good;
  good.create_time = new Date(good.create_time);
  let url = await cloud.getTempFileURL({
    fileList: [good.goodsUrl]
  })
  good.goodsUrl = url.fileList[0].tempFileURL;

  return await db.collection("user_goods").where({
    openId: openId
  }).update({
    data: {
      goods: _.push(good)
    }
  })
}