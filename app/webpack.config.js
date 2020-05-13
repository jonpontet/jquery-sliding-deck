const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    devtool: 'source-map',
    mode: 'production',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true,
    module: {
        rules: [{
            test: /\.(webm|mp4|png|jpeg)(\?.*)?$/,
            loader: 'ignore-loader',
        }, {
            test: /locales/,
            loader: '@alienfast/i18next-loader',
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                // Resolves url() and @imports inside CSS
                'css-loader', {
                    // Transform SASS to standard CSS
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        implementation: require('sass'),
                        sassOptions: {
                            fiber: false,
                            outputStyle: 'compressed'
                        },
                    },
                },
            ],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.html',
            template: './src/template.html.ejs'
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css'
        })
    ]
};