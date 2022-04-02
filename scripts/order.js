import http from "k6/http"
import { check, sleep } from "k6"
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';

let logCartIDs = []
let logLotteryIDs = []
let logOrderIDs = []
const DEFAULT_HEADERS = {
    headers: {'Content-Type': 'application/json'}
}
const ACCESS_TOKEN = "eroT5Zp5hFqEZVcUSKI5"
const KSLPLUS_API_BASE_URL = "https://asia-east1-kslplusstaging.cloudfunctions.net/api/v1"
const KSLSERVICE_API_BASE_URL = "https://asia-east1-kslplusstaging.cloudfunctions.net/api2/v1"

export const options = {
    // vus: 5,
    // duration: '30s',
}
function logObj(obj) {
    console.log(JSON.stringify(obj))
}
function callGet(url, headers = DEFAULT_HEADERS){
    const res = http.get(url, headers)
    check(res, {
        'get status was 200': (r) => r.status == 200
    })
    try {
        return res.json()
    } catch(error){
        console.log(res.body)
        return null
    }
}
function callPost(url, payload, headers = DEFAULT_HEADERS){
    const res = http.post(url, JSON.stringify(payload), headers)
    check(res, {
        'post status was 200': (r) => r.status == 200
    })
    try {
        return res.json()
    } catch(error){
        console.log(res.body)
        return null
    }
}
function userInfo() {
    const url = `${KSLPLUS_API_BASE_URL}/users/me`
    const payload = {}
    const headers = {
        headers: {'Content-Type': 'application/json', 'accesstoken':ACCESS_TOKEN}
    }
    return callPost(url, payload, headers)
}

function initCart() {
    const url = `${KSLPLUS_API_BASE_URL}/carts/init`
    const payload = {}
    return callPost(url, payload)
}
function randomLotteries() {
    const searchParams = new URLSearchParams([
        ['type', 'random'],
        ['isSeries', 'all'],
    ]);
    const url = `${KSLPLUS_API_BASE_URL}/lotteries/random?${searchParams.toString()}`
    return callGet(url)
}
function addLotteriesToCart(cartId, lotteryIDs) {
    const url = `${KSLPLUS_API_BASE_URL}/carts/addItem`
    const payload = {
        cartId,
        items:lotteryIDs
    }
    return callPost(url, payload)
}
function createOrder(cartId, lotteries = [], isGift = false, message = "") {
    const url = `${KSLPLUS_API_BASE_URL}/orders`
    const payload = {
        agent: null,
        cartId,
        isGift,
        lotteries,
        message
    }
    let headers = DEFAULT_HEADERS
    headers.headers["accesstoken"] = ACCESS_TOKEN
    return callPost(url, payload, headers)
}
function verifyQRCode() {}
function notificationORCode(){}

// export function setup(){
//     return {logCartIDs, logLotteryIDs, logOrderIDs}
// }
export default function () {
    const {cartId} = initCart()
    const {series, single} = randomLotteries().data
    const lotteryIDs = [...series.map(l => l.id), ...single.map(l => l.id)]
    logObj({cartId})
    logObj({seriesIDs:series.map(l => l.id), singleIDs:single.map(l => l.id)})
    addLotteriesToCart(cartId, lotteryIDs)
    const order = createOrder(cartId)
    logObj({orderId:order.id})
    // logObj(order)
}
// export function teardown(data) {
//     console.log(JSON.stringify(data));
// }