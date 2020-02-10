import Sequelize from 'sequelize';

import User from '../app/models/user';
import Recipients from '../app/models/recipient';

import databaseConfig from '../config/database';

const models = [User, Recipients];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}
export default new Database();
