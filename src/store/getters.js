const getters = {
    shopCount: state => {
        let count = 0
        if(typeof state.cart.userInfo.cartList != 'undefined'){
            state.cart.userInfo.cartList.forEach(item=>{
                count += item.count
            })
        }
        return count
    }
}

export default getters