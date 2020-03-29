export function toMoney(money = 0) {
    let newMoney = money;
    if(newMoney){
        newMoney = newMoney.toFixed(2)
    }else {
        newMoney = 0;
        newMoney = newMoney.toFixed(2)
    }
    return newMoney
}