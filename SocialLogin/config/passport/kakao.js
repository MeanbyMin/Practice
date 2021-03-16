// npm i passport-kakao
const KakaoStrategy = require('passport-kakao').Strategy
const config = require('../config');

module.exports = function(app, passport){
    return new KakaoStrategy({
    clientID : config.kakao.clientID,
    clientSecret: config.kakao.clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    callbackURL : config.kakao.callbackURL,
    profileFields: ['profile', 'account_email', 'gender', 'age_range', 'friends', 'birthday']
    },
    (accessToken, refreshToken, profile, done) => {
        let database = app.get('database');
        database.MemberModel.findOne({userid: profile.id}, (err, user) => {
            if(err) return done(err);

            if(!user){  // user의 정보값이 없으면 정보를 넣어 주기 위함
                const user = new database.MemberModel({
                    name: profile.username,
                    userid: profile.id,
                    roles: ['authenticated'],
                    provider: 'kakao',
                    kakao: profile._json, // json으로 넘어온 값을 통째로 넣어줌
                });

                user.save((err) => {
                    if(err) { console.log(err) }
                    return done(null, user);    // err는 없고 user객체를 callback으로 돌려줌
                });
            }else{  // 회원가입이 이미 되어있는 상황
                return done(null, user);    // 그냥 user객체를 return 시켜준다.
            }
        })
    }
    )
}