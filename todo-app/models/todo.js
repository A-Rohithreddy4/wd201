/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static async getTodos() {
      return this.findAll();
    }

    static async getOverdue(userId) {
      let today = new Date().toISOString();
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
          userId,
          completed: false,
        },
      });
    }

    static async getDueToday(userId) {
      let today = new Date().toISOString();
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
          userId,
          completed: false,
        },
      });
    }

    static async getDueLater(userId) {
      let today = new Date().toISOString();
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          userId,
          completed: false,
        },
      });
    }

    static async getCompletedTodos(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
      });
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    setCompletionStatus(check) {
      return this.update({
        completed: check,
      });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
