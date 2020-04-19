const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {

    return {

        resolveLoader: {
            modules: ['node_modules', path.resolve(__dirname, 'webpack-loaders')]
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
            },
            extensions: ['*', '.ts', '.js', '.vue', '.json']
        },
        context: path.join(__dirname, 'src'),
        entry: [
            './app/index.ts'
        ],
        output: {
            path: path.join(__dirname, 'build/dist'),
            filename: 'bundle.js'
        },
        devServer: {
            contentBase: './build/dist',
            historyApiFallback: true,
            noInfo: true,
            overlay: true,
            host: '0.0.0.0',
            port: 8091,
        },
        devtool: 'inline-source-map',
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.pug$/,
                    oneOf: [
                        {
                            resourceQuery: /^\?vue/,
                            use: ['pug-plain-loader']
                        },
                        {
                            use: ['raw-loader', 'pug-plain-loader']
                        }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        'less-loader',
                    ]
                },
                {
                    test: /\.vue$/,
                    use: {loader: 'vue-loader'}
                },
                {
                    test: /\.ts$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                },
                {
                    test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]',
                            outputPath: 'assets'
                        }
                    }
                },
                {
                    test: /\.worker\.js$/,
                    use: { loader: 'worker-loader' }
                }
            ]
        },
        performance: {
            hints: false
        },
        plugins: [
            new CleanWebpackPlugin(),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: `index.pug`,
                hash: true,
            }),
        ],
    };
};
