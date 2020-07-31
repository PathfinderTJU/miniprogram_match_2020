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
  console.log(event)
  const wxContext = cloud.getWXContext()

  
  return  usergoods.where({
    openId: wxContext.OPENID
  }).field({
    goods: true
  }).get()
}