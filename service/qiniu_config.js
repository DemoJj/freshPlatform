//七牛云配置(获取凭证)
const qiniu = require('qiniu');

const autoInfo = {
    accessKey:'nal34RqtlZYi528hvGbwDw6jVgeFYRpYuAj0eKH4',
    secretKey:'eHxus_H2KcYZlh0jI3saExK8kS6cisf3FCO2ZXc-',
    scope:'demojx-img'
}

//创建上传凭证
const accessKey = autoInfo.accessKey;
const secretKey = autoInfo.secretKey;
const mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
const options = {
    scope:autoInfo.scope,
    expires:10
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

module.exports = {
    uploadToken
}