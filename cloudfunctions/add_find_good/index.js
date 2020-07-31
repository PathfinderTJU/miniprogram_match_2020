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
  let good = event.good;
  let latitude = event.latitude;
  let longitude = event.longitude;
  good.loseTime = new Date(good.loseTime);

  good.location = db.Geo.Point(longitude, latitude);

  return await db.collection("lose_goods").add({
    data: good
  })
}