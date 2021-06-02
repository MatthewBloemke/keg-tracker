const path = require("path")

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
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", "*"]
    }
}