import { useParams } from "react-router-dom";

export const useRecovery = () => {
  const sendEmail = async (email) => {
    const url = false;
    // params === "all"
    //   ? `${import.meta.env.VITE_API_URL}/workouts`
    //   : `${import.meta.env.VITE_API_URL}/workouts?split=${params.get(
    //       "split"
    //     )}&alt=${params.get("alt")}`;

    try {
      const response = await fetch(
        url || "http://localhost:3000/recovery/password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        console.log(await response);
        throw new Error("Login failed");
      }
      console.log(await response);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const params = useParams()
  const resetPassword = async (password) => {
    const url = false;
    // params === "all"
    //   ? `${import.meta.env.VITE_API_URL}/workouts`
    //   : `${import.meta.env.VITE_API_URL}/workouts?split=${params.get(
    //       "split"
    //     )}&alt=${params.get("alt")}`;

    try {
      const response = await fetch(
        url || `http://localhost:3000/recovery/${params.id}/${params.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        console.log(await response);
        throw new Error("Login failed");
      }
      console.log(await response);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // console.log(workouts);
  return { sendEmail, resetPassword };
};
