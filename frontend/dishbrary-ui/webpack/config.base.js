const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/js/index.js"
    },
    output: {
        path: __dirname + "/../target/dist/static"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "src/index.html",
            filename: "index.html"
        })
    ]
};
