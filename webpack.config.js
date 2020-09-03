const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {viewer: './src/viewer/index.js', excalidraw: './src/excalidraw/index.js'},
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'js'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/react', '@babel/env']
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.woff2$/i,
                loader: 'url-loader',
                options: {
                    limit: 1048576,
                }
            },
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ]
};
