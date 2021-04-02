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
  let driver = await new Builder().forBrowser("chrome").build();
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

    for (let i = 15; i < 20; i++) {
      // 각 항목 만들기
      let r_writer = "admin";
      let r_restaurant = "";
      let r_grade;
      // let r_repphoto = "";
      let r_repadd = "";
      let r_address = "";
      let r_jibunaddress = "";
      let r_tel = "";
      let r_foodtype = "";
      let r_price = "";
      let r_parking = "";
      let r_openhour = "";
      let r_breaktime = "";
      let r_lastorder = "";
      let r_holiday = "";
      let r_website = "";
      let r_menu = "";
      let r_menuprice = "";
      let r_menuphoto = "";
      let r_status = "미등록";

      let resultElements = await driver.findElements(By.className("thumb"));

      // 대표사진 찾기
      // let repphoto = (
      //   await (
      //     await resultElements[i].findElement(By.className("center-croping"))
      //   ).getAttribute("data-original")
      // )
      //   .split("?")[0]
      //   .trim();
      // // console.log(await repphoto);
      // r_repphoto = repphoto;

      // 대표주소 찾기
      let repadd = await driver.findElements(
        By.css(".restaurant-item .info .etc")
      );
      r_repadd = await (await (await repadd[i].getText()).split("-")[0]).trim();
      // console.log(await r_repadd);

      // 각 리스트 클릭하기
      await resultElements[i].click();

      // 가게명 찾기
      let restaurant_name = await driver.findElement(
        By.className("restaurant_name")
      );
      r_restaurant = await restaurant_name.getText();
      // console.log(r_restaurant);

      //   평점 찾기
      let rate = await driver.findElement(By.className("rate-point"));
      let ratepoint = await rate.findElement(By.css("span"));
      r_grade = Number(await ratepoint.getText());
      // console.log(await typeof r_grade);

      //   정보 찾기
      let table = await driver.findElement(
        By.css(".pg-restaurant .restaurant-detail .info")
      );
      let tableBody = await table.findElement(By.css("tbody"));
      let infomation = await tableBody.findElements(By.css("tr"));
      // console.log(await infomation.length);

      for (let j = 0; j < infomation.length; j++) {
        // 정보 제목 찾기
        let info_title = await infomation[j].findElement(By.css("th"));
        // console.log(await info_title.getText());
        // 정보 내용 찾기
        let info_content = await infomation[j].findElement(By.css("td"));

        // 주소 찾기
        if ((await info_title.getText()).includes("주소")) {
          let adSplit = await (await info_content.getText()).split("\n");
          r_address = await adSplit[0];
          let jiSplit = await adSplit[1].split("지번");
          r_jibunaddress = await jiSplit[1].trim();
        }

        // 전화번호
        if ((await info_title.getText()).includes("전화번호")) {
          r_tel = await info_content.getText();
          // console.log(await r_tel);
        }

        // 음식 종류
        if ((await info_title.getText()).includes("음식 종류")) {
          r_foodtype = await info_content.getText();
          // console.log(await r_foodtype);
        }

        // 가격대
        if ((await info_title.getText()).includes("가격대")) {
          r_price = await info_content.getText();
          // console.log(await r_price);
        }

        // 주차
        if ((await info_title.getText()).includes("주차")) {
          r_parking = await info_content.getText();
          // console.log(await r_parking);
        }

        // 영업시간
        if ((await info_title.getText()).includes("영업시간")) {
          let openhour = await (await info_content.getText()).split("\n");
          for (let n = 0; n < openhour.length; n++) {
            r_openhour += openhour[n].trim() + ",";
          }
          r_openhour = r_openhour.substr(0, r_openhour.length - 1);
          // console.log(await r_openhour);
        }

        // 쉬는시간
        if ((await info_title.getText()).includes("쉬는시간")) {
          r_breaktime = await info_content.getText();
          // console.log(await r_breaktime);
        }

        // 마지막주문
        if ((await info_title.getText()).includes("마지막주문")) {
          r_lastorder = await info_content.getText();
          // console.log(await r_lastorder);
        }

        // 휴일
        if ((await info_title.getText()).includes("휴일")) {
          r_holiday = await info_content.getText();
          // console.log(await r_holiday);
        }

        // 웹사이트
        if ((await info_title.getText()).includes("웹 사이트")) {
          r_website = await (
            await info_content.findElement(By.css("a"))
          ).getAttribute("href");
          // console.log(await r_website);
        }

        // 메뉴
        if ((await info_title.getText()).includes("메뉴")) {
          let menu = await (await info_content.getText()).split("\n");
          for (let m = 0; m < menu.length; m++) {
            if (m % 2 == 0) {
              r_menu += menu[m].trim() + ",";
            } else {
              r_menuprice += menu[m].trim() + ",";
            }
          }
          r_menu = r_menu.substr(0, r_menu.length - 1);
          r_menuprice = r_menuprice.substr(0, r_menuprice.length - 1);
          // console.log(await r_menu);
          // console.log(await r_menuprice);
        }
      }
      // console.log(await r_address);
      // console.log(await r_jibunaddress);

      try {
        let imageArea = await driver.findElement(
          By.css("table tbody td .list-thumb-photos")
        );
        // imageArea가 있다면 클릭
        await imageArea.click();

        // Apply timeout for 5 seconds
        //   파일로딩이 안될 시 로딩을 위해서 20초 기다리기
        await driver.manage().setTimeouts({ implicit: 20000 });
        //   await driver.wait(() => {
        //     return true;
        //   }, 2000);

        let fotorama__nav__frame = await driver.findElements(
          By.className("fotorama__nav__frame")
        );

        //   console.log(await fotorama__nav__frame.length);

        // 메뉴판 사진이 있을 시에 5장 이하로만 가져오기
        for (let l = 0; l < 5; l++) {
          // await actions.doubleClick(fotorama__nav__frame[l]).perform();

          let fotorama__img = await fotorama__nav__frame[l].findElement(
            By.className("fotorama__img")
          );

          // img src 찾기
          // Get attribute of current active element
          let url = await fotorama__img.getAttribute("src");
          url = await url.split("?")[0];
          r_menuphoto += (await url) + ",";
        }
        r_menuphoto = r_menuphoto.substr(0, r_menuphoto.length - 1);

        // r_menuphoto 찍어보기
        // console.log(await r_menuphoto);

        // 빈 배열 만들기
        let resultarr = [];

        // 배열에 값 넣기
        resultarr.push(
          r_writer,
          r_restaurant,
          r_grade,
          r_repadd,
          r_address,
          r_jibunaddress,
          r_tel,
          r_foodtype,
          r_price,
          r_parking,
          r_openhour,
          r_breaktime,
          r_lastorder,
          r_holiday,
          r_website,
          r_menu,
          r_menuprice,
          r_menuphoto,
          r_status
        );

        console.log(await resultarr);

        await driver.manage().setTimeouts({ implicit: 10000 });
        await pool.getConnection(function (err) {
          if (err) throw err;
          console.log("Connected!");
          let param = resultarr;
          // sql로 데이터 저장 설정
          let sql =
            "INSERT INTO 테이블명 (r_writer, r_restaurant, r_grade, r_repadd, r_address, r_jibunaddress, r_tel, r_foodtype, r_price, r_parking, r_openhour, r_breaktime, r_lastorder, r_holiday, r_website, r_menu, r_menuprice, r_menuphoto, r_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          pool.query(sql, param, function (err, result) {
            if (err) throw err;
            console.log("DB 추가 완료");
          });
        });

        // 뒤로가기
        await driver.navigate().back();

        // 새로고침
        //   await driver.navigate().refresh();

        // menuphoto가 없을 때
      } catch (err) {
        r_menuphoto = "";

        // 빈 배열 만들기
        let resultarr = [];

        resultarr.push(
          r_writer,
          r_restaurant,
          r_grade,
          r_repadd,
          r_address,
          r_jibunaddress,
          r_tel,
          r_foodtype,
          r_price,
          r_parking,
          r_openhour,
          r_breaktime,
          r_lastorder,
          r_holiday,
          r_website,
          r_menu,
          r_menuprice,
          r_menuphoto,
          r_status
        );

        console.log(await resultarr);

        await driver.manage().setTimeouts({ implicit: 2000 });
        await pool.getConnection(function (err) {
          if (err) throw err;
          console.log("Connected!");
          let param = resultarr;
          let sql =
            "INSERT INTO 테이블명 (r_writer, r_restaurant, r_grade, r_repadd, r_address, r_jibunaddress, r_tel, r_foodtype, r_price, r_parking, r_openhour, r_breaktime, r_lastorder, r_holiday, r_website, r_menu, r_menuprice, r_menuphoto, r_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          pool.query(sql, param, function (err, result) {
            if (err) throw err;
            console.log("DB 추가 완료");
          });
        });

        // 뒤로가기
        await driver.navigate().back();
      } finally {
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
