const uuid = require("uuid");
const Messages = require("./messages");
const { DaoPaaS } = require("@dao42/d42paas-front");
const {
  getEnvironmentsApi,
  getCodeZoneIdApi,
  getPlaygroundIdApi,
  getTicketApi,
} = require("./http");

const versionMap = {};

const selectEnvChange = function () {
  const selectVersion = document.getElementById("select-version");
  selectVersion.options.length = 0;
  const envId = document.forms["select-form"]["select-env"].value;
  if (versionMap[envId]) {
    versionMap[envId].forEach((env) => {
      selectVersion.options.add(new Option(env.name, env.id));
    });
  }
};

async function main() {
  const environments = await getEnvironmentsApi();
  const selectEnv = document.getElementById("select-env");
  environments.forEach((env) => {
    selectEnv.options.add(new Option(env.name, env.id));
    versionMap[env.id] = env.versionList;
  });
  selectEnvChange();
}

async function initDaoPasS() {
  const selectForm = document.getElementById("select-form");
  const environmentVerId =
    document.forms["select-form"]["select-version"].value;
  // 随机生成临时用户
  const userInfo = { userId: uuid.v4().replace(/-/g, "") };
  userInfo.username = userInfo.userId.slice(0, 6);
  if (environmentVerId && !window.ticket) {
    // 获取ticket(票)，获取到的ticket应该放置到后端，同一个票不同用户即可实现协同功能
    const codeZoneId = await getCodeZoneIdApi(environmentVerId);
    const playgroundId = await getPlaygroundIdApi(codeZoneId);
    window.ticket = await getTicketApi(playgroundId, userInfo);
    selectForm.style.display = "none";
  }

  if (window.ticket) {
    // 创建实例
    const dao = new DaoPaaS({
      tenantId: "1",
      ticket: window.ticket, // ticket(票)
      userInfo, // 用户信息
    });
    window.dao = dao;

    // 把实例的组件挂载到dom节点
    dao.mapRender([
      { container: ".tree-section", item: "Tree" },
      { container: ".editor-section", item: "Editor" },
      { container: ".browser-section", item: "Browser" },
      { container: ".terminal-section", item: "Shell" },
      { container: ".console-section", item: "Console" },
    ]);
    function updateBtn(dockerStatus) {
      const btn = document.getElementById("btn");
      document.getElementById("control").style.display = "block";
      btn.disabled = false;
      if (dockerStatus !== "RUNNING") {
        // 运行容器
        dao.runPlayground();
        btn.innerHTML = "运行";
        btn.onclick = function () {
          dao.runPlayground();
        };
      } else {
        // 停止容器运行
        btn.innerHTML = "停止";
        btn.onclick = function () {
          dao.stopPlayground();
        };
      }
    }
    // 监听消息
    dao.onMessage((message) => {
      const { name, payload } = message;
      switch (name) {
        case Messages.Ready:
          console.log("playgroundInfo状态", dao.playgroundInfo.status);
          console.log("语法补全状态", dao.playgroundInfo.lspStatus);
          console.log("docker运行状态", dao.playgroundInfo.runStatus);
          if (dao.playgroundInfo.status === "INACTIVE") {
            dao.activePlayground();
          }
          break;
        case Messages.Online:
          console.log("网络已恢复");
          break;
        case Messages.Offline:
          console.log("网络掉线");
          break;
        case Messages.StatusChanged:
          console.log("playground状态发生变化", payload.status);
          updateBtn(dao.playgroundInfo.status);
          break;
        case Messages.PlaygroundChanged:
          console.log("playground环境变了，比如换题");
          break;
        case Messages.LspStatusChanged:
          console.log("Lsp状态发生变化", payload.status);
          break;
        case Messages.RunStatusChanged:
          console.log("docker运行状态变化", payload.status);
          if (payload.status != "STOP") {
            return;
          } else if (payload.runResult === 0) {
            console.log(`运行结果成功`);
          } else {
            console.log(`运行结果失败: ${payload.runResult}`);
          }
          break;
        case Messages.UsersUpdated: {
          console.log("用户更新", payload.agentUsers);
          break;
        }
        case Messages.FileInfo: {
          console.log("打开文件", payload.openedPath);
        }
      }
    });
    // 监听错误消息
    dao.onError((message) => {
      const { name } = message;
      switch (name) {
        case Messages.ConnectionBroken:
          console.log("与服务器的连接中断，可以尝试连接到另一个服务器");
          break;
        case Messages.AuthorizationFailed:
          console.log("授权失败，所以您需要再次登录或获得一个新的ticket");
          break;
        case "errorFromServer":
          console.log("与服务器的连接中断");
          break;
      }
    });
  }
}

window.selectEnvChange = selectEnvChange;
window.initDaoPasS = initDaoPasS;

main();
