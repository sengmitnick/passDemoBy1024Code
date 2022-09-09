const axios = require("axios");
const CryptoJS = require("crypto-js");

const request = axios.create({
  timeout: 60 * 1000, // 请求超时时间 10 s
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    console.log(config.data);
    const key = CryptoJS.enc.Utf8.parse("secret");
    const timestamp = Date.now().toString();
    const sha256 = CryptoJS.SHA256(
      JSON.stringify(config.data || {})
    ).toString();
    const nonce = sha256.slice(0, 8);
    const msg = "tenantCode" + "_" + nonce + "_" + timestamp;
    const token = CryptoJS.AES.encrypt(msg, key, {
      mode: CryptoJS.mode.ECB,
    }).toString();
    config.headers = {
      ...config.headers,
      tenantCode: "demo",
      userId: "2",
      nonce,
      timestamp,
      token,
    };
    return config;
  },
  (error) => {
    // 发送失败
    console.error("error in axios request", error);
    return Promise.reject(error);
  }
);

/**
 * 获取codeZone环境列表
 * @returns { Promise<{id: string; name: string;versionList: {id: string; name: string}[]}[]> }
 **/
async function getEnvironmentsApi() {
  const res = await request.get("/api/v1/sdk/environments");
  return res.data.data; // 环境列表(数组)
}
/**
 * 创建codeZone, 获取codeZoneId
 * @param { string } environmentVerId 环境id
 * @returns { Promise<string> }
 **/
async function getCodeZoneIdApi(environmentVerId) {
  const res = await request.post("/api/v1/sdk/codeZones", { environmentVerId });
  return res.data.data.id;
}
/**
 * 通过 codeZoneId 获取 playgroundId
 * @param { string } codeZoneId
 * @returns { Promise<string> }
 **/
async function getPlaygroundIdApi(codeZoneId) {
  const res = await request.get(
    "/api/v1/sdk/codeZones/" + codeZoneId + "/playground"
  );
  return res.data.data.id;
}
/**
 * 通过 playgroundId 获取 ticket
 * @param { string } playgroundId
 * @returns { Promise<string> }
 **/
async function getTicketApi(playgroundId, userInfo) {
  const res = await request.post("/api/v1/sdk/ticket", {
    playgroundId,
    tillTime: Date.now() + 12 * 60 * 60 * 1000, // 截止时间(时间戳)
    userInfo, // 数据格式请参考接口文档
  });
  return res.data.data.ticket;
}

module.exports = {
  getEnvironmentsApi,
  getCodeZoneIdApi,
  getPlaygroundIdApi,
  getTicketApi,
};
