module.exports = function(router, passport){
    console.log('route_member 호출!');

    router.route('/').get((req, res) => {
        res.render('index.ejs');
    });

    router.route('/login').get((req, res) => {
        res.render('login.ejs');
    });
 
    router.route('/signup').get((req, res) => {
        res.render('signup.ejs');
    });

    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.route('/profile').get((req, res) => {
        if(!req.user){  // session이 담기면 req.user에 담기게 된다.
            console.log('사용자 인증이 안된 상태');
            res.redirect('/');
            return;
        }
        console.log('사용자 인증 상태');
        if(Array.isArray(req.user)){    // req.user가 배열로 넘어오면
            res.render('profile.ejs', {user:req.user[0]});  // profile.ejs를 부르면서 배열중 첫번째 걸 저장할것이다.
        }else{
            res.render('profile.ejs', {user: req.user})     //배열이 아닌 경우는 user자체를 profile에게 넘겨줌.
        }
    });

    router.route('/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['public_profile', 'email']  // email이 기본요청 항목에 없어서 따로 scope로 요청
    }));

    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect: '/profile_facebook',
        failureRedirect: '/'
    }))

    router.route('/profile_facebook').get((req, res) => {
        if(!req.user){  // session이 담기면 req.user에 담기게 된다.
            console.log('사용자 인증이 안된 상태');
            res.redirect('/');
            return;
        }
        console.log('사용자 인증 상태');
        if(Array.isArray(req.user)){    // req.user가 배열로 넘어오면
            res.render('profile_facebook.ejs', {user:req.user[0]});  // profile.ejs를 부르면서 배열중 첫번째 걸 저장할것이다.
        }else{
            res.render('profile_facebook.ejs', {user: req.user})     //배열이 아닌 경우는 user자체를 profile에게 넘겨줌.
        }
    });

    router.route('/auth/kakao').get(passport.authenticate('kakao',{
        failureRedirect: '#!/login'
    }));

    router.route('/oauth').get(passport.authenticate('kakao', {
        successRedirect: '/profile_kakao',
        failureRedirect: '/'
    }),(req, res) => {
        res.redirect('/');
    });

    router.route('/profile_kakao').get((req, res) => {
        if(!req.user){  // session이 담기면 req.user에 담기게 된다.
            console.log('사용자 인증이 안된 상태');
            res.redirect('/');
            return;
        }
        console.log('사용자 인증 상태');
        if(Array.isArray(req.user)){    // req.user가 배열로 넘어오면
            res.render('profile_kakao.ejs', {user:req.user[0]});  // profile.ejs를 부르면서 배열중 첫번째 걸 저장할것이다.
        }else{
            res.render('profile_kakao.ejs', {user: req.user})     //배열이 아닌 경우는 user자체를 profile에게 넘겨줌.
        }
    });
    

    router.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    })
}
