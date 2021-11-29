const { resourceMiddleware } = require('./src/resource-middleware');

const express = require('express');

// Set up the express app
run();

async function run(options = {}, port = 3000) {
    const app = express();
    
    app.use(resourceMiddleware());

    const server = app.listen(port, () => {
        console.log(`server running on port ${port}`)
    });

    return server;
}

module.exports = {
    run
};

