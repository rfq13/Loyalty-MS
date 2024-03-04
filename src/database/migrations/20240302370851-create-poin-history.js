'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PoinHistories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      poin:{
        type: Sequelize.INTEGER,
      },
      remainingPoin:{
        type: Sequelize.INTEGER,
      },
      TrxCode: {
        type: Sequelize.STRING,
      },
      MemberId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: 'Members',
          key: 'id',
        },
      },
      ProgramId: {
        allowNull: true,
        type: Sequelize.UUID,
        defaultValue: null,
      },
      detail: {
        type: Sequelize.TEXT,
      },
      type:{
        type: Sequelize.ENUM('Add Transaction', 'Redeem Poin', 'Member Get Member', 'Member Activity', 'Birthday Bonus'),
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
    await queryInterface.dropTable('PoinHistories')
  },
}
