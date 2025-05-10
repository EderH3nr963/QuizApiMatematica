import { Sequelize } from "sequelize";

const sequelize = new Sequelize("quiz_matematica", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
