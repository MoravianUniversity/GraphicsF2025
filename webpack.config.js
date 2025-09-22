/* globals require, module, __dirname */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");

const files = glob.sync('./[1-9]-*/*.html').map(pth => pth.replace('.html', ''));

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
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(stl|gltf|glb|bin|obj|mtl)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        // Copy files from source to destination for examples from before using webpack
        new CopyWebpackPlugin({
            patterns: [
                { from: "favicon.*", to: "." },
                { from: "index.html", to: "." },
                { from: "./0-Day-1/*.js", to: "." },
                { from: "./0-Day-1/*.html", to: "." },
                { from: "./1-JS-Basics/*.css", to: "." },
            ],
        }),
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
        static: [
            {
                directory: path.join(__dirname, 'assets'),
                publicPath: '/assets'
            }
        ]
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