// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'test-260nv'
})


const db = cloud.database({
  env: 'test-260nv'
});

const usersTable = db.collection("user")
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openId = wxContext.OPENID;

  //更新用户信息，返回用户openId
  if (event.update) {
    try {
      await usersTable.where({
          openId: openId
        }).update({
          data:{
            avatarUrl: event.avatarUrl,
            nickName: event.nickName,
            gender: event.gender,
            openId: openId
          },
      })

      return {
        openId: openId
      }
    } catch (e) {
      console.error(e)
    }
  } else if (event.getSelf) {
    //获取当前用户信息
    try {
      let count = await usersTable.where({
        openId: openId // 填入当前用户 openid
      }).count();

      if (count.total === 0){
        await usersTable.add({
          data: {
            openId: openId,
            avatarUrl: event.avatarUrl,
            nickName: event.nickName,
            gender: event.gender,
          }
        })

        await db.collection("user_goods").add({
          data: {
            openId: openId,
            goods: []
          }
        })

        return {
          openId: openId
        }
      }else{
        await usersTable.where({
          openId: openId
        }).update({
          data: {
            avatarUrl: event.avatarUrl,
            nickName: event.nickName,
            gender: event.gender,
            openId: openId
          },
        })

        return {
          openId: openId
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}