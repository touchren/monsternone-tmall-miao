let count = 0;
while (true && count++ < 10) {
  text("抽奖").findOne(5000).click();
  sleep(6000);
  let comBtn = textMatches("(立即完成|开心收下|累计任务奖励).*").findOne(5000);
  log(comBtn.text());
  if (comBtn.text() == "累计任务奖励") {
    break;
  }
  click(comBtn.bounds().centerX(), comBtn.bounds().centerY());
  if (comBtn == "立即完成") {
    sleep(5000);
    back();    
  } 
  sleep(3000);
}
