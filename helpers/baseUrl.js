const config = require('config');

let baseUrl = `${config.get('node.protocol')}://${config.get('node.hostname')}`;
if (config.environment === 'development') {
  baseUrl = `${baseUrl}:${config.get('node.port')}`;
}

module.exports = baseUrl;
