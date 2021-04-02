const { Builder, By, Key, until } = require("selenium-webdriver");
const mysql = require("mysql");

const pool = mysql.createPool({
  // connectionLimit: 10, // 동시접속자를 의미하는데, 분초까지 동일한 시간에 접속을 해야 동시접속자로 인정이된다.
  host: "", // mysql host
  // port: "3306", // mysql port
  user: "", // mysql 아이디
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
    let keyword = "식당";
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
      let r_photo = "";

      let resultElements = await driver.findElements(By.className("thumb"));

      // 각 리스트 클릭하기
      await resultElements[i].click();

      // 가게명 찾기
      let restaurant_name = await driver.findElement(
        By.className("restaurant_name")
      );
      r_restaurant = await restaurant_name.getText();

      // 사진 리스트 찾아서 클릭하기
      try {
        let owl_wrapper = await driver.findElement(By.className("owl-wrapper"));
        await owl_wrapper.click();

        // 사진들 로딩이 되게끔 15초 가량 기다리기
        await driver.manage().setTimeouts({ implicit: 15000 });
        let fotorama__nav__frame = await driver.findElements(
          By.className("fotorama__nav__frame")
        );

        //   console.log(await fotorama__nav__frame.length);

        // 사진은 5장만 가져오기
        for (let l = 0; l < 5; l++) {
          let fotorama__img = await fotorama__nav__frame[l].findElement(
            By.className("fotorama__img")
          );

          // img src 찾기
          // Get attribute of current active element
          let url = await fotorama__img.getAttribute("src");
          url = await url.split("?")[0];
          r_photo += (await url) + ",";
        }
        r_photo = r_photo.substr(0, r_photo.length - 1);

        let resultarr = [];

        resultarr.push(r_photo, r_restaurant);

        await driver.manage().setTimeouts({ implicit: 10000 });
        await pool.getConnection(function (err) {
          if (err) throw err;
          console.log("Connected!");
          let param = resultarr;
          let sql = "UPDATE 테이블명 SET 컬럼명=? WHERE 컬럼명=?";
          pool.query(sql, param, function (err, result) {
            if (err) throw err;
            console.log("DB 추가 완료");
          });
        });

        // 뒤로가기
        await driver.navigate().back();
      } catch (err) {
        await driver.navigate().back();
      }
    }

    // 4초를 기다린다.
    try {
      await driver.wait(() => {
        return false;
      }, 4000);
    } catch (err) {}
  } finally {
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
