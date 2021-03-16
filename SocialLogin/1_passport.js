const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
// npm i passport
const passport = require('passport');
const static = require('serve-static');
const path = require('path');
// npm i express-error-handler
const expressErrorHandler = require('express-error-handler');


const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(logger('dev'));
// passport의 세션을 사용하려면 그전에 express의 세션을 사용하는 코드가 먼저 나와야 합니다.
app.use(passport.initialize()); // 패스포트 초기화
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', static(path.join(__dirname, "public")));

app.use('/', router);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const config = require('./config/config');
const database = require('./database/database');

const configPassport = require('./config/passport');
configPassport(app, passport);

const userPassport = require('./routes/route_member');
userPassport(router, passport);


app.listen(config.server_port, ()=> {
    console.log(`${config.server_port}포트로 서버 실행중...`);
    database.init(app, config);
});

