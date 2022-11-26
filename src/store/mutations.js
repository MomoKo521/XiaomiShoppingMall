const mutations = {
    // 清空所有state中的数据
    resetVuex(state) {
        state.searchObj = {}
        state.newAddress = {}
        state.areaCode = []
        state.currentPro = {}
        state.userInfo = {
            headImage: ''
        }
        state.shoppingCart = {}
        state.cartNumber = ''
        state.evaluateOrders = {}
        state.noticeId = {}
        state.collectData = {}
    },
    //存储用户信息
    SET_USERINFO(state, obj) {
        state.userInfo = obj
    },
    //存储购物车信息
    SET_SHOPPINGCART(state, arr) {
        state.shoppingCart = arr
    },
    //存储购物车数量
    SET_CARTNUMBER(state, number) {
        state.cartNumber = number
    },
    //重置vuex中有关用户的信息数据
    ALL_REMOVE(state) {
        state.userInfo = {}
        state.cartNumber = ''
        state.shoppingCart = []
        state.newAddress = {}
        state.areaCode = []
    },
    // 存储搜索关键字
    SET_SEARCHKEWORD(state, keywrod) {
        state.searchkeywrod = keywrod
    },
    // 存储新增修改收货地址
    SET_NEWADDRESS(state, newaddress) {
        state.newAddress = newaddress
    },
    // 存储当前区域编号
    SET_AREACODE(state, areaCode) {
        state.areaCode = areaCode
    },
    //清空收货地址newAddress  当前区域编号
    RESE_ADDRESS(state) {
        state.newAddress = {}
        state.areaCode = []
    }
}

export default mutations