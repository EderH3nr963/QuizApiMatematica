import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";
import { compare, genSalt, hash } from "bcrypt";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public id_user?: number;
  public username!: string;
  public email!: string;
  public password?: string;
  public xp!: number;
  public is2fa!: boolean;
  public validPassword!: (password: string) => Promise<boolean>;
}

User.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [3, 20], // valida que o username deve ter entre 3 e 20 caracteres
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is2fa: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user",
    sequelize,
    timestamps: true,
  }
);

User.beforeSave(async (user) => {
  if (user.changed("password")) {
    if (!user.password) return;

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
  }
});

User.prototype.validPassword = async function (password: string) {
  if (!this.password) return false;

  return await compare(password, this.password);
};

export default User;
