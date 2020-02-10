import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipCode: {
          type: Sequelize.STRING,
          field: 'zip_code',
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
