import { listSearchMixin } from "@/config/mixin";
import api from '@/api'
const actions = {
    //获取购物车数据
    async getshopingcart({ commit }) {
        let params = {
            url: api.getcartInfo,
            method: "get",
        }
        let refult = listSearchMixin.methods.sendReq(params, res => {
            if (res.status == 200) {
                //console.log(res);
                // 存储购物车数据到state中
                commit('SET_SHOPPINGCART', res.data.valid)
                commit('SET_CARTNUMBER', res.data.valid.length)

            }
        })

    }
}
export default actions;