const local_signup = require('./passport/local_signup');
const local_login = require('./passport/local_login');
const facebook = require('./passport/facebook');
const kakao = require('./passport/kakao');

module.exports = function(app, passport){
    console.log('config/passport 호출!');

    passport.serializeUser((user, done) => {
        console.log('serializeUser() 호출!', user);
        done(null, user);
    })
    
    passport.deserializeUser((user, done) => {
        console.log('deserializeUser() 호출!', user);
        done(null, user);
    });

    passport.use('local-signup', local_signup);
    passport.use('local-login', local_login);
    passport.use('facebook', facebook(app, passport));
    passport.use('kakao', kakao(app, passport));
}