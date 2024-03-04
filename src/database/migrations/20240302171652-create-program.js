'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('Programs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      type:{
        type: Sequelize.ENUM('transaction', 'community'),
        allowNull: false,
        defaultValue: 'transaction',
      },
      minAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      minQty: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isForFirstTrx: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      maxPoin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      benefitType:{
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'percentage',
      },
      activity:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Add Transaction',
      },
      benefitValue: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Programs')
  },
}
