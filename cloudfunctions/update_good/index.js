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
  let id = event.id;
  let change = event.changeImg
  good.create_time = new Date(good.create_time)

  if (change){
    //获取新文件URL
    let url = await cloud.getTempFileURL({
      fileList: [good.goodsUrl]
    })
    good.fileId = good.goodsUrl;
    good.goodsUrl = url.fileList[0].tempFileURL;

    //删除老文件
    let fileId = event.fileId;
    await cloud.deleteFile({
      fileList: [fileId]
    })
  }

  await db.collection("user_goods").where({
    openId: openId
  }).update({
    data: {
      goods: _.pull({
        goods_id: id
      })
    }
  })

  return await db.collection("user_goods").where({
    openId: openId
  }).update({
    data: {
      goods: _.push(good)
    }
  })
}