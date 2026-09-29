import { useAuth } from "../components/auth/authContext";

// The user's display unit. Weights are stored in pounds; this only affects
// what is rendered and what typed input is interpreted as.
export function useWeightUnit() {
  const { user } = useAuth();
  return user?.weightUnit === "KG" ? "KG" : "LB";
}
