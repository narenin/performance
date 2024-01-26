/**
 * External dependencies
 */
const path = require( 'path' );
const WebpackBar = require( 'webpackbar' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const sharedConfig = {
	...defaultConfig,
	entry: {},
	output: {},
};

/**
 * Transformer to get version from package.json and return it as a PHP file.
 *
 * @param {Buffer} content      The content as a Buffer of the file being transformed.
 * @param {string} absoluteFrom The absolute path to the file being transformed.
 *
 * @return {string} The transformed content.
 */
const assetDataTransformer = ( content, absoluteFrom ) => {
	if ( 'package.json' !== path.basename( absoluteFrom ) ) {
		return content;
	}

	const contentAsString = content.toString();
	const contentAsJson = JSON.parse( contentAsString );
	const { version } = contentAsJson;

	return `<?php return '${ version }'; ?>`;
};

const webVitals = () => {
	const source = path.resolve( __dirname, 'node_modules/web-vitals' );
	const destination = path.resolve(
		__dirname,
		'modules/images/image-loading-optimization/detection'
	);

	return {
		...sharedConfig,
		plugins: [
			new CopyWebpackPlugin( {
				patterns: [
					{
						from: `${ source }/dist/web-vitals.js`,
						to: `${ destination }/[name].[ext]`,
					},
					{
						from: `${ source }/package.json`,
						to: `${ destination }/web-vitals.asset.php`,
						transform: {
							transformer: assetDataTransformer,
							cache: false,
						},
					},
				],
			} ),
			new WebpackBar( {
				name: 'Web Vitals',
				color: '#f5a623',
			} ),
		],
	};
};

module.exports = [ webVitals ];
