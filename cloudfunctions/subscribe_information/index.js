// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-260nv'
})


const db = cloud.database({
  env: 'test-260nv'
});


// 云函数入口函数
exports.main = async (event, context) => {
  let goodsName = event.goodsName;
  let openId = event.openId;
  let name = event.name;
  let location = event.location;
  let date = event.date;
    try {
      return await cloud.openapi.subscribeMessage.send({
        touser: openId, // 通过 getWXContext 获取 OPENID
        data: {
          thing1: {
            value: goodsName
          },
          name2: {
            value: name
          },
          date3: {
            value: date
          },
          thing5: {
            value: location
          }
        },
        templateId: 'Li_69X97-71jde4i78K4aOgGDeq3Z280edx_QsTC8gQ'
      })
      // result 结构
      // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    } catch (err) {
      // 错误处理
      // err.errCode !== 0
      throw err
    }
}