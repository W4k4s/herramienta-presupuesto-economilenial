/**
 * Configuración optimizada de Webpack para Economilenial Budget
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
    },
    
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        chunkFilename: '[name]-[chunkhash].js',
        clean: true
    },
    
    optimization: {
        ...defaultConfig.optimization,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                recharts: {
                    test: /[\\/]node_modules[\\/](recharts)[\\/]/,
                    name: 'recharts',
                    priority: 20
                },
                jspdf: {
                    test: /[\\/]node_modules[\\/](jspdf)[\\/]/,
                    name: 'jspdf',
                    chunks: 'async',
                    priority: 20
                },
                wordpress: {
                    test: /[\\/]node_modules[\\/]@wordpress[\\/]/,
                    name: 'wordpress',
                    priority: 15
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10
                }
            }
        }
    },
    
    performance: {
        hints: 'warning',
        maxAssetSize: 250000,
        maxEntrypointSize: 250000
    }
};
