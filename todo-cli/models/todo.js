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
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueList = await this.overdue();
      await overdueList.map((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueTodayList = await this.dueToday();
      await dueTodayList.map((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLaterList = await this.dueLater();
      await dueLaterList.map((item) => {
        console.log(item.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };
      var dateToday = new Date();
      const today = formattedDate(dateToday);

      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };
      var dateToday = new Date();
      const today = formattedDate(dateToday);

      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };
      var dateToday = new Date();
      const today = formattedDate(dateToday);

      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      try {
        return Todo.update(
          {
            completed: true,
          },
          {
            where: {
              id: id,
            },
          }
        );
      } catch (err) {
        console.err(err);
      }
    }

    displayableString() {
      const formattedDate = (d) => {
        return d.toISOString().split("T")[0];
      };
      var dateToday = new Date();
      const today = formattedDate(dateToday);
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate === today ? " " : this.dueDate
      }`.trim();
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
