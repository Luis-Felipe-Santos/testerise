import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Token de autenticação ausente", code: 401 });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Formato de token inválido", code: 401 });
  }

  const token = authHeader.slice(7);

  const secretKey = process.env.SECRET_KEY as string;

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      console.error("Erro na verificação do token:", err);
      return res
        .status(401)
        .json({ message: "Token de autenticação inválido", code: 401 });
    }

    (req as any).user = decoded;
    next();
  });
};

export default authMiddleware;
