
module.exports = app => {

    const api = require('../modules/controllers/token_api');
    //const checkAuth = require('../middleware/checkAuth')

    app.post('/token_api',api.token )

}

