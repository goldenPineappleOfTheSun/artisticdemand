const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
        admin: './src/admin.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/transform-runtime'],
                },
            },
        },
        { test: /\.vue$/, loader: 'vue-loader' },
        { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
        {
            test: /\.(svg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'svg',
            },
        }],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};
