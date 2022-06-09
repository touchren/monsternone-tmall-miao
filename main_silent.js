require("./Unlock.js").exec();

// let util = require("utils.js");

// 在此处给脚本排队即可
let filePathList = ["start.js", "start_jd.js", "jd_choujiang.js"];

filePathList = filePathList.map(function (filePath) {
  return files.path(filePath);
});

events.on("exit", function () {
  log("所有任务执行完毕, 退出主进程");
});

setInterval(function () {}, 1000);
// 60分钟
let limitTime = 60 * 60 * 1000;

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
    // 锁屏 Android
    auto.service.performGlobalAction(8);
    sleep(1000);
    engines.myEngine().forceStop();
  }
}

function closeLogFloat() {
  home();
  sleep(2000);
  press(635, 145, 50);
  sleep(1000);
  filePathList.shift();
}
