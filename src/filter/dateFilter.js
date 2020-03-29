export function dateFormat(val){
    let date = new Date(val);
    let newDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return newDate;
}