const webpack = require('webpack')

exports.onCreateWebpackConfig = ({
  actions,
}) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.ContextReplacementPlugin(/@emurgo\/cardano-serialization-lib-browser/),
    ],
  })
}