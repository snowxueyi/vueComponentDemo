
let config= {
    userUrl: 'http://183.134.75.126:9999/user/',
    // userUrl: 'http://192.168.20.191:8084/lqb-user-web',
    // 测试服务器地址
    url: 'http://183.134.75.126:9999/cms/',
    couponUrl: 'http://183.134.75.126:9999/coupon/',
    //bankUrl : 'http://183.134.75.125/lqb-coupon-web/',
    urlAuth: 'http://183.134.75.126:9999/',
    urlsso: 'http://183.134.75.126:9999/',
    localUrl: 'http://183.134.75.126:9999'
}
if(typeof window !== 'undefined'&&window.fn){
    config=fn;
}
export default config;