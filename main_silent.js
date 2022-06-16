require("./Unlock.js").exec();

let uitlsPath = "../meituanmaicai/Utils.js"; //"./Utils.js"

let { getProjectConfig, globalLogConfig, hasUpdate ,updateByGit } = require(uitlsPath);

globalLogConfig();

let PROJECT_NAME = "monsternone-tmall-miao";

let project = getProjectConfig();

// 在此处给脚本排队即可
// "start.js", 
let filePathList = ["start_jd.js", "jd_choujiang.js"];

filePathList = filePathList.map(function (filePath) {
  return files.path(filePath);
});

events.on("exit", function () {
  toastLog("所有任务执行完毕, 退出主进程");
});

setInterval(function () {}, 1000);
// 60分钟
let limitTime = 60 * 60 * 1000;

checkUpdate();

while (1) {
  if (filePathList.length > 0) {
    // 开始任务前先关闭日志悬浮窗
    closeLogFloat();
    let e = engines.execScriptFile(filePathList[0]);
    while (!e.getEngine()); //等待脚本运行
    let currentScriptEngine = e.getEngine();
    let lastTime = new Date().getTime();
    while (1) {
      let currentTime = new Date().getTime();
      let confirmBtn = id("md_buttonDefaultPositive").findOnce();
      if (confirmBtn) {
        log("检测到[确定]按钮, 等待用户自己选择");
        sleep(10 * 1000);
        if ((confirmBtn = id("md_buttonDefaultPositive").findOnce())) {
          log("用户未进行选择, 自动[确定]");
          confirmBtn.click();
        }
      }
      if (currentTime - lastTime > limitTime) {
        log("脚本运行超时, 开始 执行销毁命令");
        currentScriptEngine.forceStop();
        log("脚本运行超时, 结束 执行销毁命令");
        break;
      }
      if (currentScriptEngine.isDestroyed()) {
        log("脚本[%s]已退出", filePathList[0]);
        break;
      } else {
        sleep(10 * 1000);
      }
    }
  } else {
    // 所有任务结束后关闭日志悬浮窗
    closeLogFloat();
    // 锁屏 Android 9 以上支持
    auto.service.performGlobalAction(8);
    sleep(1000);
    log("test log1");
    engines.myEngine().forceStop();
    log("test log2");
  }
  filePathList.shift();
}

function closeLogFloat() {
  home();
  sleep(2000);
  press(635, 145, 50);
  sleep(1000);
}

function checkUpdate() {
  let folder = engines.myEngine().cwd() + "/";
  console.log("脚本所在路径: ", folder);
  try {
    let res = hasUpdate("/touchren/" + PROJECT_NAME, "silent", "project.json");
    if (res) {
      updateByGit(PROJECT_NAME);
      let count = 3;
      while (!isUpdated() && count-- > 0) {
        toastLog("更新还未完成, 请稍等");
        sleep(10000);
      }
      if (isUpdated()) {
        toastLog("更新成功, 建议重新运行程序");
      } else {
        toastLog("更新失败, 请稍后重试");
      }
    }
  } catch (err) {
    toast("检查更新出错，请手动前往项目地址查看");
    console.error(err);
    console.error(err.stack);
    return;
  }
}

function isUpdated() {
  let newProject = getProjectConfig();
  if (newProject.versionName != project.versionName) {
    log("新版本信息: ", newProject);
    return true;
  } else {
    return false;
  }
}
