import * as express from 'express';
import * as path from 'path';
const app: express.Express = express();

// トレイルスラッシュ削除（リダイレクト）
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.substr(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
})

// env読み込み
require('dotenv').config();
const env = process.env

// セッション設定
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
  port: parseInt(env.REDIS_PORT || '6379'),
  host: env.REDIS_HOST
});

app.use(session({
  secret: 'secret', // TODO
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({
    client: redisClient,
    prefix: 'sid'
  }),
  cookie: {
    path: '/',
  }
}))

// テンプレートエンジン設定
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// 静的ファイルルーティング
app.use('/static', express.static('dist'));
app.use('/public', express.static('public'));
//app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(express.json());

// local variables
app.use((req: any, res: express.Response, next: express.NextFunction) => {
  res.locals.isAuthen = req.session.token ? true : false;
  res.locals.isTop = req.path === '/' ? true : false;
  next();
})

// ルーティング
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/*', require('./routes/error'));

const port = parseInt(env.APP_PORT || '3001');
app.listen(port, () => { console.log(`listening on port ${port}`) });
