# 拾物TJU-丢失物品找回微信小程序

- 2020高校微信小程序开发大赛参赛作品

- 作者

  - 天津大学 智能与计算学部 刘兴宇
  - 天津大学 智能与计算学部 刘杭学
  - 天津大学 机械工程学院 孙镜越

- 需要导入本项目，请配置自己的云环境：

  - 注册自己的云环境，记录云环境ID

  - 在`app.js`的`onLaunch`函数中，修改`env`属性为自己的环境ID

    ~~~javascript
    onLaunch: function () {
        
        if (!wx.cloud) {
          console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
          wx.cloud.init({
            env: , //自己的ID
            traceUser: true,
          })
        }
      }
    ~~~

  - 在云开发数据库中新建以下集合：

    - user
    - user_goods
    - lose_goods

  - 在微信开发者工具IDE中，右键点击cloudfunctions文件夹，点击同步云函数列表，对每个云函数右键点击上传并部署（云端安装依赖），直到所有云函数图标变为云朵状

  - 配置完成，测试小程序不报错即为成功。

  - 备注：发送订阅消息云函数`subscribe_information`中，请将`tempId`改成自己要发送的模板ID