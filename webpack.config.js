const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		host: "0.0.0.0"
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		},
		{
			test: /\.ts|\.tsx$/,
			use: 'ts-loader'
		}]
	}
};
