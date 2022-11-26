import Vue from 'vue'
import VueRouter from 'vue-router'
// import Cookie from 'js-cookie'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'layout',
    component: () =>
        import ('@/views/layout.vue'),
    redirect: { name: 'index' }, //默认home组件
    children: [{
            path: '/index',
            name: 'index',
            component: () =>
                import ('@/views/home/home.vue'),
            meta: {
                // 控制是否展示搜索框
                searchVisible: true
            },

        },
        // 商品分类
        {
            path: '/category',
            name: 'category',
            component: () =>
                import ('@/views/category/index.vue'),
            meta: {
                searchVisible: true
            },
        },
        // 商品搜索
        {
            path: '/search',
            name: 'search',
            component: () =>
                import ('@/views/search/index.vue'),
            meta: {
                searchVisible: true
            },
        },
        // 商品详情
        {
            path: '/productDetail',
            name: 'productDetail',
            component: () =>
                import ('@/views/product/productDetail.vue'),
            meta: {
                searchVisible: true
            },
        },
        // 购买商品
        {
            path: '/placeOrder',
            name: 'placeOrder',
            component: () =>
                import ('@/views/placeOrder'),
            meta: {
                searchVisible: true
            },
        },
        // 购物车
        {
            path: '/shopping-cart',
            name: 'shoppingCart',
            component: () =>
                import ('@/views/shopping-cart'),
            meta: {
                searchVisible: true
            },
        },
        //用户中心
        {
            path: '/usercenter',
            name: 'usercenter',
            component: () =>
                import ('@/views/userCenter/usercenter.vue'),
            meta: {
                searchVisible: false
            },
            children: [
                //个人信息
                {
                    path: '/userInfo',
                    name: 'userInfo',
                    component: () =>
                        import ('@/views/userCenter/myInfo'),
                },
                //我的订单
                {
                    path: '/myOrder',
                    name: 'myOrder',
                    component: () =>
                        import ('@/views/userCenter/myOrder'),
                },
                //钱包充值
                {
                    path: '/rechargewallet',
                    name: 'rechargewallet',
                    component: () =>
                        import ('@/views/userCenter/rechargewallet'),
                },
                //收货地址
                {
                    path: '/receiptAddress',
                    name: 'receiptAddress',
                    component: () =>
                        import ('@/views/userCenter/receiptAddress'),
                },
                //我的收藏
                {
                    path: '/myCollection',
                    name: 'myCollection',
                    component: () =>
                        import ('@/views/userCenter/myCollection'),
                },
                //浏览足迹
                {
                    path: '/browseRecords',
                    name: 'browseRecords',
                    component: () =>
                        import ('@/views/userCenter/browseRecords'),
                },
            ]
        },
        // 订单详情
        {
            path: '/orderDetail',
            name: 'orderDetail',
            component: () =>
                import ('@/views/orderDetail'),
            meta: {
                searchVisible: true
            },
        },
        // 评价
        {
            path: '/evaluate',
            name: 'evaluate',
            component: () =>
                import ('@/views/evaluate'),
            meta: {
                searchVisible: true
            },
        },

    ]

}, {
    path: '/login',
    name: 'login',
    component: () =>
        import ('@/views/login/login.vue')
}]


const router = new VueRouter({
    routes
})


export default router