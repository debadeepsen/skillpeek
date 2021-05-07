module.exports = (app) => {
    const job = require('../controllers_mysql/job.controller.js');

    app.get('/employers', job.getEmployers);
    app.get('/employer/profile/:id', job.getEmployerProfile);

    app.get('/job/:id', job.getJobDetails);

    app.get('/cities', job.getCities);
    app.get('/location/suggestions/:keyword', job.getLocationSuggestions);
    app.get('/search', job.getSearchResults);
}

