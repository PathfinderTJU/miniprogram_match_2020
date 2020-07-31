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
  let latitude = event.latitude;
  let longitude = event.longitude;

  return await db.collection("lose_goods").where({
    location: _.geoNear({
      geometry: db.Geo.Point(longitude, latitude),
      minDistance: 0,
      maxDistance: 5000
    })
  }).orderBy("loseTime", "desc").limit(10).get()
}