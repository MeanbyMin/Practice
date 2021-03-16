// npm i passport-facebook
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config')

module.exports = function(app, passport){
    return new FacebookStrategy({   // FacebookStrategy객체를 리턴시켜 줄 건데, 그 안에 많은 설정값을 넣어서 보내줄 것이다.
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']}, // facebook에 요청할 것들
        (accessToken, refreshToken, profile, done) => {
            console.log('passport의 facebook 호출');
            console.dir(profile);

            // database에서 가져온다.
            let database = app.get('database');
            database.MemberModel.findOne({userid: profile.id}, (err, user) => {
                if(err) return done(err);

                if(!user){  // user의 정보값이 없으면 정보를 넣어 주기 위함
                    const user = new database.MemberModel({
                        name: profile.displayName,
                        userid: profile.id,
                        provider: 'facebook',
                        authToken: accessToken,
                        facebook: profile._json // json으로 넘어온 값을 통째로 넣어줌
                    });

                    user.save((err) => {
                        if(err) { throw err; }
                        return done(null, user);    // err는 없고 user객체를 callback으로 돌려줌
                    });
                }else{  // 회원가입이 이미 되어있는 상황
                    return done(null, user);    // 그냥 user객체를 return 시켜준다.
                }
            })
        }); 
}