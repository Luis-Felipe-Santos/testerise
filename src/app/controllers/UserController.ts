import { Request, Response, Router } from "express";
import User from "../entities/User";
import UserRepository from "../repositories/UserRepository";
import IUser from "../interfaces/IUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth";

const userRouter = Router();
const secretKey = process.env.SECRET_KEY; 

function formatResponse(
  data: any,
  message: string,
  code: number,
  messageCode: string
) {
  return {
    message,
    code,
    message_code: messageCode,
    data,
  };
}
userRouter.post(
  "/cadastro",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        const response = formatResponse(
          {},
          "Nome, email e senha são obrigatórios.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new instance of the user
      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      newUser.password = hashedPassword;

      const savedUser = await UserRepository.createUser(newUser);

      const response = formatResponse(
        { user: savedUser },
        "Usuário cadastrado com sucesso",
        201,
        "success"
      );
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      const response = formatResponse(
        {},
        "Erro ao cadastrar usuário",
        500,
        "error"
      );
      return res.status(500).json(response);
    }
  }
);

userRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response = formatResponse(
          {},
          "Email e senha são obrigatórios.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      const { user, token } = await UserRepository.loginUser(email, password);

      if (!user) {
        const response = formatResponse(
          {},
          "Usuário não encontrado.",
          401,
          "authentication_error"
        );
        return res.status(401).json(response);
      }

      const response = formatResponse(
        { user, token },
        "Login bem-sucedido",
        200,
        "success"
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const response = formatResponse({}, "Erro ao fazer login", 500, "error");
      return res.status(500).json(response);
    }
  }
);

userRouter.use(authMiddleware); 

userRouter.get("/", async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await UserRepository.getUsers();
    const response = formatResponse(
      users,
      "Requisição bem-sucedida",
      200,
      "success"
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    const response = formatResponse(
      {},
      "Erro ao buscar usuários",
      500,
      "error"
    );
    return res.status(500).json(response);
  }
});


userRouter.put(
  "/:userId",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const updatedData = req.body;

      if (!userId) {
        const response = formatResponse(
          {},
          "User ID is required.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      console.log(`Updating user with ID: ${userId}`);
      const updatedUser = await UserRepository.updateUser(userId, updatedData);

      if (!updatedUser) {
        console.log(`User with ID ${userId} not found.`);
        const response = formatResponse(
          {},
          "User not found.",
          404,
          "not_found"
        );
        return res.status(404).json(response);
      }

      console.log(`User with ID ${userId} updated successfully.`);
      const response = formatResponse(
        { user: updatedUser },
        "User updated successfully",
        200,
        "success"
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error updating user:", error);
      const response = formatResponse({}, "Error updating user", 500, "error");
      return res.status(500).json(response);
    }
  }
);

userRouter.delete(
  "/:userId",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.userId, 10);

      if (!userId) {
        const response = formatResponse(
          {},
          "O ID do usuário é obrigatório.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      const deletionResult = await UserRepository.deleteUser(userId);

      if (deletionResult.success) {
        const response = formatResponse(
          deletionResult.deletedUser, 
          "Usuário deletado com sucesso",
          200, 
          "success"
        );
        return res.status(200).json(response);
      } else {
        const response = formatResponse(
          {},
          `Usuário com ID ${userId} não encontrado.`,
          404,
          "not_found"
        );
        return res.status(404).json(response);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const response = formatResponse(
        {},
        "Erro ao deletar usuário",
        500,
        "error"
      );
      return res.status(500).json(response);
    }
  }
);

export default userRouter;
