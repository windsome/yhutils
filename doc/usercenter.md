## 用户中心系统设计
### 任务
1. 完成用户登录注册认证等
2. 第三方系统授权
3. 个人基本信息维护.
4. 积分系统/商品统计相关等,不应该放到本系统中.

### 数据库系统
1. 用户基础信息表 userbase(user详情使用外部用户系统, 内部维护用户状态)
{
    _id 用户_id
    status 状态: 0:正常，1：注销，2：待审核（申请开通中）,3:审核失败
    num // 序号,用来做展示,不做关联. 默认从10000开始. 注册时自动生成,在原有最大值基础上加1.(去掉某些特殊规则的号码,比如豹子号).
    nickname // 昵称
    avatar // 头像
    evel // 级别:0~10
    desc: { // 额外描述信息
        cover //个人中心封面
    }
    caps // 权限列表,全部用大写字母: [ROOT]
}
2. 用户扩展信息表 userextend
{
    _id, // 同Userbase的id.
    phone // 用户真实电话.
    password: { // 密码
    vphone // 虚拟手机号.
    address: [ // 收货地址列表. 其中ismain表示默认地址
       {
        name: '张三',
        phone: '15519634856',
        district: [
           { id: 10000, name: '安徽省' },
           { id: 100001, name: '黄山市' },
           { id: 1000011, name: '歙县' }
         ],
         road: '新安路16号',
         postcode: '245200',
         ismain: 1
       }
    ]
    wechat: {// 微信相关信息,
      openid,
      unionid,
      ... // 其他用户详细信息: head_image, sex, ...
    }
    wallet: {// 个人钱包信息,
      amount, // 钱包余额.
      withdrawType, // 提现类型:0无,1银行卡,2支付宝,3微信支付
      ...withdraw // 提现信息, 银行账号/开户行/户名;支付宝账号;微信账号;不同提现手段字段不同.
    }
    cert: {// 个人认证相关.
      idcardFront, // 身份证头像面.
      idcardBack, // 身份证国徽面.
      photo, // 头像照片.
      video // 一段眨眼摇头视频.
    }
3. 登录或操作日志表 userops
{
    _id 消息_id
    user // 操作用户id
    type操作类型
    content {} // 操作内容.
    createdAt 创建时间
}

### 对外接口.
#### 登录-电话登录
/auth_by_phone_password //根据电话和密码登录
/auth_by_phone_smscode // 根据电话和验证码登录
/auth_by_phone_smscode/get_sms_code // 获取登录验证码
/bind_phone // 绑定电话号码
/bind_phone/get_sms_code // 绑定电话号码时获取smscode
/change_phone // 修改电话号码
/change_phone/get_sms_code //需要验证码
#### 登录-微信登录
/auth_by_code_state //微信code/state登录
/get_authorize_url //获取微信授权登录地址.
#### 登录-小程序登录
/auth_by_weapp_code //小程序登录
/update_weapp_ phone //更新微信小程序手机号
#### 登录-已登录情况下刷新登录
/auth_by_token // token登录 {返回token应该包含有效期}
/auth_by_cookie //cookie登录
/refresh // 刷新登录
#### 登录-退出
/logout //退出登录
#### 登录-综合登录
/auth_by_code_or_cookie // 首先判断cookie登录,再判断微信code/state登录
#### 获取用户信息.
1. 获取本人信息 /meinfo
2. 获取单个用户信息. /user/:_id
3. 获取用户列表的信息列表. /user?q=:query
#### 刷新token有效期
/token_check //检查token,返回有效期. 其他系统如聊天系统,可据此判断是否有效, 如果聊天系统token更换,则可以调用来判断新token是否有效
/token_refresh //刷新token,返回有效期,