# Node.js를 이용한 Social Network Service 로그인입니다.



Node.js와 mongoDB를 이용하였습니다.

1. 회원가입 한 후 로그인(local-login)
2. 페이스북 로그인
3. 카카오 로그인

---

3가지 방법을 만들었습니다.

유지 보수가 편하도록 섹션을 나누었습니다.

+ config 폴더 안 config 파일
  + db 설정을 해주세요.
  + facebook과 kakao에 각 각 해당하는 clientId 와 clientSecret, callbackURL 를 설정하여 사용하면 됩니다.

---

참조 문헌

[passport-kakao] <https://www.npmjs.com/package/passport-kakao>

[passport-facebook] <https://www.npmjs.com/package/passport-facebook>
