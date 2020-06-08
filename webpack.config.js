const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (async () => {
    return {
        // let the plugin determine the correct handler entry points at build time
        entry: slsw.lib.entries,
        target: 'node',
        mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
        // 'source-map' is to have a proper stacktraces
        devtool: 'source-map',
        // we use webpack-node-externals to excludes all node deps.
        // You can manually set the externals too.
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    loader: 'babel-loader',
                    // only include files present in the `src` subdirectory
                    include: __dirname,
                    // exclude node_modules, equivalent to the above line
                    exclude: /node_modules/,
                    query: {
                        plugins: ['@babel/transform-runtime']
                    }
                },
            ],
        }
    };
})();
