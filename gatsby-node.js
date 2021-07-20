const webpack = require('webpack')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.ContextReplacementPlugin(/@emurgo\/cardano-serialization-lib-browser/),
    ],
    experiments: {
      asyncWebAssembly: true,
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/async',
        },
      ]
    },
  })
}