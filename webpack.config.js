/* globals require, module, __dirname */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");

const files = glob.sync('./[1-9]-*/*.js').map(pth => pth.replace('.js', ''));
console.log(files)

const config = {
    mode: 'development',
    entry: files.reduce((acc, file) => {
        acc[file] = file + ".js";
        return acc;
    }, {}),
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        // Copy files from source to destination for examples from before using webpack
        new CopyWebpackPlugin({
            patterns: [
                { from: "./0-Day-1/*.js", to: "." },
                { from: "./1-JS-Basics/*.css", to: "." },
            ],
        }),
        new HtmlWebpackPlugin({template: './index.html'}),
        new HtmlWebpackPlugin({template: './0-Day-1/first.html', filename: './0-Day-1/first.html'}),
        new HtmlWebpackPlugin({template: './0-Day-1/first-solution.html', filename: './0-Day-1/first-solution.html'}),
        ...files.map(file => new HtmlWebpackPlugin({template: `./${file}.html`, filename: `./${file}.html`, chunks: [file]})),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
    },
    devServer: {
        port: 8080,
        hot: true,
    },
    resolve: {
        extensions: ['.js'],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};

module.exports = config;