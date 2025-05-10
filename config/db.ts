import { Sequelize } from "sequelize";

const sequelize = new Sequelize("quiz_math", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
