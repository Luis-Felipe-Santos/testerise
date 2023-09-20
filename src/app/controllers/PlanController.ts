import { Request, Response, Router } from "express";
import PlanRepository from "../repositories/PlanRepository";
import IPlan from "../interfaces/IPlan";
import authMiddleware from "../middleware/auth";
const planRouter = Router();

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
planRouter.use(authMiddleware); 
planRouter.get("/",  async (_req: Request, res: Response): Promise<Response> => {
  try {
    const plans = await PlanRepository.getPlans();
    const response = formatResponse(
      plans,
      "Requisição bem-sucedida",
      200,
      "success"
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    const response = formatResponse(
      {},
      "Erro ao buscar planos",
      500,
      "error"
    );
    return res.status(500).json(response);
  }
});

planRouter.post(
  "/cadastro",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { name, descricao, valor } = req.body;

      if (!name || !descricao || !valor) {
        const response = formatResponse(
          {},
          "Nome, descrição e valor são obrigatórios.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }
      const newPlan: IPlan = {
        name,
        descricao,
        valor,
      };

      const savedPlan = await PlanRepository.createPlan(newPlan);

      const response = formatResponse(
        { plan: savedPlan },
        "Plano cadastrado com sucesso",
        201,
        "success"
      );
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      const response = formatResponse(
        {},
        "Erro ao cadastrar plano",
        500,
        "error"
      );
      return res.status(500).json(response);
    }
  }
);

planRouter.put(
  "/:planId",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const planId = parseInt(req.params.planId, 10);
      const updatedData = req.body;

      if (!planId) {
        const response = formatResponse(
          {},
          "ID do plano é obrigatório.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      console.log(`Updating plan with ID: ${planId}`);
      const updatedPlan = await PlanRepository.updatePlan(planId, updatedData);

      if (!updatedPlan) {
        console.log(`Plan with ID ${planId} not found.`);
        const response = formatResponse(
          {},
          "Plano não encontrado.",
          404,
          "not_found"
        );
        return res.status(404).json(response);
      }

      console.log(`Plan with ID ${planId} updated successfully.`);
      const response = formatResponse(
        { plan: updatedPlan },
        "Plano atualizado com sucesso",
        200,
        "success"
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error updating plan:", error);
      const response = formatResponse({}, "Error updating plan", 500, "error");
      return res.status(500).json(response);
    }
  }
);

planRouter.delete(
  "/:planId",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const planId = parseInt(req.params.planId, 10);

      if (!planId) {
        const response = formatResponse(
          {},
          "O ID do plano é obrigatório.",
          400,
          "validation_error"
        );
        return res.status(400).json(response);
      }

      const deletionResult = await PlanRepository.deletePlan(planId);

      if (deletionResult.success) {
        const response = formatResponse(
          deletionResult.deletedPlan, 
          "Plano deletado com sucesso",
          200, 
          "success"
        );
        return res.status(200).json(response);
      } else {
        const response = formatResponse(
          {},
          `Plano com ID ${planId} não encontrado.`,
          404,
          "not_found"
        );
        return res.status(404).json(response);
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      const response = formatResponse(
        {},
        "Erro ao deletar plano",
        500,
        "error"
      );
      return res.status(500).json(response);
    }
  }
);

export default planRouter;