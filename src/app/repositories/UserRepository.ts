import User from "../entities/User";
import IUser from "../interfaces/IUser";
import { AppDataSource } from "../../database/data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);
const secretKey = process.env.SECRET_KEY || "your-secret-key"; 


const getUsers = async (): Promise<IUser[]> => {
  try {
    const users = await userRepository.find();
    return users;
  } catch (error) {
    throw error;
  }
};

const createUser = async (user: User): Promise<User> => {
  try {
    const existingUser = await userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new Error("Email já cadastrado");
    }

    return await userRepository.save(user);
  } catch (error) {
    throw error;
  }
};

const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser | null; token: string | null }> => {
  try {
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user || !user.password) {
      return { user: null, token: null };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { user: null, token: null };
    }

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    return { user, token };
  } catch (error) {
    throw error;
  }
};

const updateUser = async (
  userId: number,
  updatedData: Partial<User>
): Promise<User | null> => {
  try {
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    if (updatedData.password) {
      if (typeof updatedData.password !== "string") {
        throw new Error("Invalid password format");
      }
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      user.password = hashedPassword;
      delete updatedData.password;
    }

    Object.assign(user, updatedData);

    return await userRepository.save(user);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (
  userId: number
): Promise<{ success: boolean; deletedUser: User | null }> => {
  try {
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      const deletedUser = { ...user }; 
      await userRepository.remove(user);
      return { success: true, deletedUser };
    } else {
      return { success: false, deletedUser: null };
    }
  } catch (error) {
    throw error;
  }
};

export default {
  getUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
