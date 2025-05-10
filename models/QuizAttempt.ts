import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import { extensions } from "sequelize/types/utils/validator-extras";

class QuizDefault extends Model<
  InferAttributes<QuizDefault>,
  InferCreationAttributes<QuizDefault>
> {
  public id_quiz_attempt?: number;
  public score!: number;
  public duration!: number;
  public id_user!: number;
  public totalQuestions!: number;
  public correctAnswers!: number;
}

QuizDefault.init(
  {
    id_quiz_attempt: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id_user",
        model: User,
      },
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "QuizDefault",
    sequelize,
    timestamps: true,
  }
);

export default QuizDefault;
