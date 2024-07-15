const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
// const dotenv = require('dotenv');
// const env = dotenv.config().parsed;

const MODE = process.env.NODE_ENV | 'development';
const enabledSourceMap = MODE === 'development';

module.exports = {
  entry: {
    // 共通アセット
    app: ['./assets/app.ts'],
    // 以下ページごとに分割する
    index: ['./assets/routes/index.ts'],
    maintenance: ['./assets/routes/maintenance.ts'],
    'user/index': ['./assets/routes/user/index.ts'],
    'user/profile': ['./assets/routes/user/profile.ts'],
    'user/email': ['./assets/routes/user/email.ts'],
    'user/verify-email': ['./assets/routes/user/verify-email.ts'],
    'user/ranking': ['./assets/routes/user/ranking.ts'],
    'user/withdrawal': ['./assets/routes/user/withdrawal.ts'],
    'user/supports': ['./assets/routes/user/supports.ts'],
    'user/support-reward': ['./assets/routes/user/support-reward.ts'],
    'user/wallet': ['./assets/routes/user/wallet.ts'],
    'user/wallet-edit': ['./assets/routes/user/wallet-edit.ts'],
    'user/password': ['./assets/routes/user/password.ts'],
    'user/register': ['./assets/routes/user/register/index.ts'],
    'user/register/confirm': ['./assets/routes/user/register/confirm.ts'],
    'user/register/account': ['./assets/routes/user/register/account.ts'],
    'user/login': ['./assets/routes/user/login/index.ts'],
    'organizations/index': ['./assets/routes/organizations/index.ts'],
    'organizations/school-supporters': [
      './assets/routes/organizations/school-supporters.ts',
    ],
    'organizations/team': ['./assets/routes/organizations/team.ts'],
    'organizations/team-supporters': [
      './assets/routes/organizations/team-supporters.ts',
    ],
    'support/index': ['./assets/routes/support/index.ts'],
    'support/wallet': ['./assets/routes/support/wallet.ts'],
    'support/wallet-edit': ['./assets/routes/support/wallet-edit.ts'],
    'support/confirm': ['./assets/routes/support/confirm.ts'],
    'support/complete': ['./assets/routes/support/complete.ts'],
    'about/index': ['./assets/routes/about/index.ts'],
    'about/support': ['./assets/routes/about/support.ts'],
    'about/privacy': ['./assets/routes/about/privacy.ts'],
    'about/company': ['./assets/routes/about/company.ts'],
    'about/faq/index': ['./assets/routes/about/faq/index.ts'],
    'about/faq/register': ['./assets/routes/about/faq/register.ts'],
    'about/faq/login': ['./assets/routes/about/faq/login.ts'],
    'about/faq/donation': ['./assets/routes/about/faq/donation.ts'],
    'about/faq/account': ['./assets/routes/about/faq/account.ts'],
    'about/faq/payment': ['./assets/routes/about/faq/payment.ts'],
    'about/faq/cancel': ['./assets/routes/about/faq/cancel.ts'],
    'about/faq/withdrawal': ['./assets/routes/about/faq/withdrawal.ts'],
    'about/contact': ['./assets/routes/about/contact.ts'],
    'about/commercial-transactions': [
      './assets/routes/about/commercial-transactions.ts',
    ],
    'about/terms': ['./assets/routes/about/terms.ts'],
    'not-found': ['./assets/routes/not-found.ts'],
    'internal-server-error': ['./assets/routes/internal-server-error.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true,
  },
  mode: MODE,
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[path][name].[ext]',
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'assets/scss')],
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/, path.resolve(__dirname, 'assets/scss/')],
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env', // プリセットを指定することで、ES2019 を ES5 に変換
          ],
        },
      },
    ],
  },
  // import 文で .ts ファイルを解決するため
  // resolve: {
  //  // Webpackで利用するときの設定
  //  alias: {
  //    vue$: "vue/dist/vue.esm.js"
  //  },
  //  extensions: ["*", ".js", ".vue", ".json", ".ts"]
  // },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, `./.env`),
      systemvars: true,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      ignoreOrder: false,
    }),
    new CaseSensitivePathsPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': JSON.stringify(env)
    // })
  ],
  optimization: {
    minimizer:
      MODE === 'development'
        ? []
        : [
            new TerserPlugin({
              extractComments: 'all', // コメント削除
              terserOptions: {
                compress: {
                  drop_console: true, // console.logの出力除去
                },
              },
            }),
          ],
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  stats: {
    errorDetails: true,
  },
};
