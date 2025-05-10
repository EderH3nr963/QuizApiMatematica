import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";

class Quest extends Model<
  InferAttributes<Quest>,
  InferCreationAttributes<Quest>
> {
  public id_quest?: number;
  public image!: string;
  public texto!: string;
  public answers!: JSON;
  public correct_answer_index!: string;
  public peso!: number;
}

Quest.init(
  {
    id_quest: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correct_answer_index: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    peso: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Quest",
    sequelize,
    timestamps: false,
  }
);

export default Quest;
