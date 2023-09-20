import Plan from "../entities/Plan";
import IPlan from "../interfaces/IPlan";
import { AppDataSource } from "../../database/data-source";

const planRepository = AppDataSource.getRepository(Plan);

const getPlans = (): Promise<IPlan[]> => {
  return planRepository.find();
};

const createPlan = async (planData: IPlan): Promise<Plan> => {
  try {
    const newPlan = planRepository.create(planData);
    return await planRepository.save(newPlan);
  } catch (error) {
    throw error;
  }
};

const updatePlan = async (
  planId: number,
  updatedPlanData: Partial<IPlan>
): Promise<Plan | null> => {
  try {
    const plan = await planRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      return null;
    }

    Object.assign(plan, updatedPlanData);

    return await planRepository.save(plan);
  } catch (error) {
    throw error;
  }
};

const deletePlan = async (
  planId: number
): Promise<{ success: boolean; deletedPlan: Plan | null }> => {
  try {
    const plan = await planRepository.findOne({
      where: { id: planId },
    });

    if (plan) {
      const deletedPlan = { ...plan }; 
      await planRepository.remove(plan);
      console.log(`Plano com ID ${planId} deletado com sucesso.`);
      return { success: true, deletedPlan };
    } else {
      console.log(`Plano com ID ${planId} não encontrado.`);
      return { success: false, deletedPlan: null };
    }
  } catch (error) {
    console.error("Erro ao deletar plano:", error);
    throw error;
  }
};

export default { getPlans, createPlan, updatePlan, deletePlan };
