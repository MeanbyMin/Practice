// branch와 repphoto를 가져오기 위해 새로운 파일 생성

const { Builder, By, Key, until } = require("selenium-webdriver");
const mysql = require("mysql");

const pool = mysql.createPool({
  // connectionLimit: 10, // 동시접속자를 의미하는데, 분초까지 동일한 시간에 접속을 해야 동시접속자로 인정이된다.
  host: "", // mysql host
  // port: "3306", // mysql port
  user: "root", // mysql 아이디
  password: "", // mysql 비밀번호
  database: "", // mysql database
  debug: false, // debug 할것인지 여부
});

(async function example() {
  let driver = await new Builder().forBrowser("firefox").build();
  try {
    // 망고플레이트 실행
    await driver.get("https://www.mangoplate.com/");

    // Javascript를 실행하여 UserAgent를 확인한다.
    let userAgent = await driver.executeScript("return navigator.userAgent;");

    console.log("[UserAgent]", userAgent);

    // 망고플레이트 검색창 id는 main-search이다. By.id로 #main-search Element를 얻어온다.
    let searchInput = await driver.findElement(By.id("main-search"));

    // 검색창에 '식당'을 치고 엔터키를 누른다.
    let keyword = "성수";
    searchInput.sendKeys(keyword, Key.ENTER);

    // css selector로 가져온 element가 위치할때까지 최대 7초간 기다린다.
    await driver.wait(
      until.elementLocated(
        By.css(
          ".pg-search .search-results .search-list-restaurants-inner-wrap .list-restaurants>li .thumb"
        )
      ),
      7000
    );

    for (let i = 18; i < 20; i++) {
      // 각 항목 만들기
      let r_restaurant = "";
      let r_repphoto = "";
      let r_branch = "";

      // 빈 배열 만들기
      let resultarr = [];

      // 가게명, branch명 찾기
      let resultElements = await driver.findElements(By.className("thumb"));
      let restaurant = await driver.findElements(
        By.css(".restaurant-item .info .title")
      );

      // 대표사진 찾기
      let repphoto = (
        await (
          await resultElements[i].findElement(By.className("center-croping"))
        ).getAttribute("data-original")
      )
        .split("?")[0]
        .trim();
      // console.log(await repphoto);
      r_repphoto = await repphoto;

      // branch가 있다면
      try {
        let branch = await restaurant[i].findElement(By.className("branch"));
        r_branch = await branch.getText();
        restaurant = await (await restaurant[i].getText()).split(" ")[0].trim();
        r_restaurant = await restaurant;

        // 배열에 값 넣기
        resultarr.push(r_repphoto, r_branch, r_restaurant);

        // branch가 없다면
      } catch (err) {
        r_restaurant = await restaurant[i].getText();
        // 배열에 값 넣기
        resultarr.push(r_repphoto, r_branch, r_restaurant);
      } finally {
        console.log(await r_restaurant);
      }

      // console.log(await restaurant);

      console.log(await resultarr);

      // DB에 가져온 값 넣기
      await pool.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");
        let param = resultarr;
        let sql = "UPDATE 테이블명 SET 컬럼명=?, 컬럼명=? WHERE 컬럼명=?";
        pool.query(sql, param, function (err, result) {
          if (err) console.log(err);
          console.log("DB 추가 완료");
        });
      });
    }
  } finally {
    // 4초를 기다린다.
    try {
      await driver.wait(() => {
        return false;
      }, 4000);
    } catch (err) {}
    pool.end(function (err) {
      if (err) {
        return console.log("error: " + err.message);
      }
      console.log("DB연결을 끊습니다.");
    });
    // 종료한다.
    console.log("셀레니움을 종료합니다.");
    driver.quit();
  }
})();
