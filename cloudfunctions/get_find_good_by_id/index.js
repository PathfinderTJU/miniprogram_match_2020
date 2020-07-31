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
  let id = event.id;

  return await db.collection("lose_goods").where({
    _id: id
  }).get();
}