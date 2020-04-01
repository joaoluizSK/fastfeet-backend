import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: {
          type: Sequelize.STRING,
        },
      },
      {
        sequelize,
        tableName: 'delivery_problems',
        freezeTableName: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
  }
}

export default DeliveryProblem;
