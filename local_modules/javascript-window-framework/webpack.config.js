const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/jwf/src/javascript-window-framework.ts',
	output: {
		library: 'javascript-window-framework',
		libraryTarget: 'amd',
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.scss/,
			use: [
					'style-loader',
					'css-loader',
					'sass-loader'
			],
		}, {
			test: /\.ts|\.tsx$/,
			use: ['ts-loader']
		}, {
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		}]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},
	devtool: 'source-map',
};
