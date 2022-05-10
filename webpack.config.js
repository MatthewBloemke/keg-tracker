const path = require("path");
const webpack = require('webpack')
const SRC = path.resolve(__dirname, 'node_modules')

module.exports = {
    entry: "./src/client/index.jsx",
    output: {
        path: path.join(__dirname, "/src/server/out"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                        {
                            loader: 'file-loader',
                            options: {
                            name: 'images/[hash]-[name].[ext]',
                            },
                        },
                    ],
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules', 'react')
        },
        extensions: [".js", ".jsx", "*"]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        }),
    ]
}