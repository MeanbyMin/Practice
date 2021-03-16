module.exports = {  // module.exports로 묶어주면 파일 이름으로 불러다 쓸 수 있다.
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/frontenddb', // 수정이 용이하다.
    db_schemas: [{  
        file: './member_schema',    // mongoose를 사용해서 schema를 만들건데, 그 schema 파일 이름을 member_schema로 하겠다는 의미
        collection: 'member2', 
        schemaName: 'MemberSchema', 
        modelName: 'MemberModel'
    }], 
    facebook: { // facebook 정보
        clientID: 'facebook clientID',
        clientSecret: 'facebook clientSecret',    
        callbackURL: 'http://localhost:3000/auth/facebook/callback' // 인증을 받고나서 다음 페이지를 어디로 갈것인지 설정
    },
    kakao: {
        clientID: 'kakao REST API key',   // REST API key
        clientSecret: '',   // 없을 시엔 ''
        callbackURL: 'http://localhost:3000/oauth'
    }
}