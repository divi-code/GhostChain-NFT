import path from 'path'
import webpack from 'webpack'
import HtmlWebPackPlugin from "html-webpack-plugin"
const __dirname = path.resolve();

const generateHtmlPlugin = (title) => {
  return new HtmlWebPackPlugin({
    title,
    filename: `${title}.html`,
    template: `./src/pages/${title}.html`,
  });
}

const populateHtmlPlugins = (pagesArray) => {
  var res = [];
  pagesArray.forEach(page => {
    res.push(generateHtmlPlugin(page));
  })
  return res;
}

const pages = populateHtmlPlugins(["index", "buy", "mint", "single" ]);

export default {
  mode: 'development',
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js'],
  },
  experiments: {
    asyncWebAssembly: true,
    // WebAssembly as async module (Proposal)
    syncWebAssembly: true,
    // WebAssembly as sync module (deprecated)
    outputModule: true,
    // Allow to output ESM
    topLevelAwait: true,
    // Allow to use await on module evaluation (Proposal)
  },
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // ensure compatibility with older browsers
            plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
       test: /\.(png|svg|jpg|gif)$/,
       use: ['file-loader']
      }
    ]
  },
  plugins: pages.concat([
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: "jquery"
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      API: 'http://localhost:80',    
    })
  ])
}
