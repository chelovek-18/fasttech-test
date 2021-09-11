const webpack = require( 'webpack' );
const path = require( 'path' );

module.exports = {
    entry: {
        "script.js": "./sources/front.js"
    },
    output: {
        path: path.join( __dirname, "/public/js" ),
        filename: "[name]"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}

/*[
    {
        resolve: {
            extensions: ['.js', '.jsx']
        },
        entry: {
            "script.js": "./sources/front.js"
        },
        output: {
            path: path.join( __dirname, "/public/js" ),
            filename: "[name]"
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    use: {
                        loader: 'babel-loader',
                        query: {
                            presets: [ '@babel/preset-env' ]
                        }
                    },
                },
            ]
        }
    }
];*/