const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/genuis-1553116125288/us-central1/', { 
    target: 'http://localhost:5000',
  }));
};