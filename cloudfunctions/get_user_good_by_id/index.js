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
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID;
  let id = event.id;

  let goods = await db.collection("user_goods").where({
    openId: openId
  }).field({
    goods: true
  }).get()

  goods = goods.data[0].goods;
  for (let i = 0; i < goods.length; i++) {
    if (goods[i].goods_id === id) {
      return {
        good: goods[i]
      }
    }
  }
}