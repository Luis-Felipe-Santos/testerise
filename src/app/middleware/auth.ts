import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtenha o token do cabeçalho de autorização
  const authHeader = req.header('Authorization');

  // Verifique se o token está presente
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação ausente', code: 401 });
  }

  // Verifique se o token começa com "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Formato de token inválido', code: 401 });
  }

  // Remova a parte "Bearer " do token
  const token = authHeader.slice(7);

  console.log('Token recebido:', token);

  // Verifique o token
  const secretKey = process.env.SECRET_KEY as string; // Obtém a chave secreta do .env
  console.log('Chave secreta:', secretKey);

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      return res.status(401).json({ message: 'Token de autenticação inválido', code: 401 });
    }

    // Se o token for válido, você pode adicionar os dados do usuário decodificado ao objeto de solicitação
    (req as any).user = decoded;
    next();
  });
};

export default authMiddleware;




