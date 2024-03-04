'use strict'

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const _ = require('lodash')

const salt = 10
const defaultPassword = 'abcdeFG6*$'

console.log(
  `${chalk.green('[server]')} ${chalk.blue('Seed')} ${chalk.green(
    'your default password: '
  )}`,
  { defaultPassword }
)

const data = [
  {
    fullName: 'Admin',
    email: 'admin@mail.com',
  },
]

const formData = []

if (!_.isEmpty(data)) {
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i]

    formData.push({
      ...item,
      id: uuidv4(),
      isActive: true,
      password: bcrypt.hashSync(String(defaultPassword), salt),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', formData)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
