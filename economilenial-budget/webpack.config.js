/**
 * Configuración de Webpack para el plugin Economilenial Budget
 * Usa @wordpress/scripts como base
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
    },
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve?.alias,
            '@': path.resolve(__dirname, 'src'),
        },
    },
};
