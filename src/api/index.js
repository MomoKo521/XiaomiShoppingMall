// 导入api接口模块
import home from './home'
// 导入购物车商品接口
import trolley from './shopping-troelly'

// 获取当前环境变量 true => 生产环境 false => 开发环境
const BASEURL = (process.env.NODE_ENV === 'production') ? '/api' : '/api'
const IMGBASEURL = 'http://192.168.106.200:8008/api'
const api = {
    // 登录模块
    ...home(IMGBASEURL), //首页模块接口
    ...trolley(IMGBASEURL), //
    BASEURL: IMGBASEURL,
    vCode: `${IMGBASEURL}/register/verify`, //获取验证码
    register: `${IMGBASEURL}/register`, //注册
    login: `${IMGBASEURL}/login`, //登陆
    getUserInfo: `${IMGBASEURL}/userinfo`, //获取用户信息
    getcartInfo: `${IMGBASEURL}/cart/list`, //获取购物车信息
    removeCart: `${IMGBASEURL}/cart/del`, //删除购物车
    getCategory: `${IMGBASEURL}/category`, //获取首页分类
    getIndexBanner: `${IMGBASEURL}/index/banner`, //获取首页轮播图
    getIndexBast: `${IMGBASEURL}/index/bastList`, //首页精品推荐
    getIndexLike: `${IMGBASEURL}/index/like`, //首页猜你喜欢
    getProducts: `${IMGBASEURL}/products`, // 查询商品
    getProDetail: `${IMGBASEURL}/product/detail/`, //商品详情
    addshoppingcart: `${IMGBASEURL}/cart/add`, //添加购物车
    addCollect: `${IMGBASEURL}/collect/add`, //添加收藏
    cancelCollect: `${IMGBASEURL}/collect/del`, //取消收藏
    getEvaluateData: `${IMGBASEURL}/reply/config/`, // 获取商品评价数据
    getEvaluateList: `${IMGBASEURL}/reply/list/`, // 获取商品评价列表
    getAddressList: `${IMGBASEURL}/address/list`, //获取用户地址列表
    getOrderInfo: `${IMGBASEURL}/order/confirm`, //获取支付订单商品订单信息
    orderprice: `${IMGBASEURL}/order/computed/`, //计算订单金额
    orderCreat: `${IMGBASEURL}/order/create/`, //订单创建
    shoppingcartNumchange: `${IMGBASEURL}/cart/num  `, //修改产品数量
    deleteCart: `${IMGBASEURL}/cart/del`, //删除购物车商品
    uptUserInfo: `${IMGBASEURL}/user/edit`, // 修改个人信息
    updateUserPassword: `${IMGBASEURL}/user/password`, //修改用户密码
    getfangan: `${IMGBASEURL}/recharge/index`, //获取充值方案
    setRecharge: `${IMGBASEURL}/recharge/test`, //模拟充值
    editAddress: `${IMGBASEURL}/address/edit`, // 编辑收货地址（添加修改）
    deleteAddress: `${IMGBASEURL}/address/del`, //删除收货地址
    getArea: `${IMGBASEURL}/city_list`, // 获取城市列表
    getcollect: `${IMGBASEURL}/collect/user`, //获取收藏或足迹
    unfavorites: `${IMGBASEURL}/collect/dels/`, // 批量取消收藏或足迹
    getmyOrder: `${IMGBASEURL}/order/list`, //获取个人中心我的订单
    payorder: `${IMGBASEURL}/order/pay`, //支付订单
    cancelorder: `${IMGBASEURL}/order/cancel`, // 取消订单
    Receipt: `${IMGBASEURL}/order/take`, //确认收货
    delorder: `${IMGBASEURL}/order/del`, //删除订单
    getorderDetail: `${IMGBASEURL}/order/detail/`, //获取订单详情
    upload: `${IMGBASEURL}/uploads`, // 图片上传
    orderComment: `${IMGBASEURL}/order/comment`, // 订单评价
}
export default api