var path = require('path');

module.exports = {
  client: 'pg',
  connection: {
    host: "127.0.0.1",
    user:"postgres",
    password:"ChicoNashjj123",
    database:"nlw",
  },

  migrations: {
    directory: path.resolve(__dirname ,'src', 'database','migrations')
  },

  seeds: {
    directory: path.resolve(__dirname ,'src', 'database','seeds')
  }
}