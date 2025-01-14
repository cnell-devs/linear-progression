import { useParams } from "react-router-dom";

export const useRecovery = () => {
  const sendEmail = async (email, setSent, setErrors) => {
    const url = false;
    // params === "all"
    //   ? `${import.meta.env.VITE_API_URL}/workouts`
    //   : `${import.meta.env.VITE_API_URL}/workouts?split=${params.get(
    //       "split"
    //     )}&alt=${params.get("alt")}`;

    try {
      const response = await fetch(
        url || `${import.meta.env.VITE_API_URL}/recovery/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {


        setErrors(await response.json());
        setSent(false);
        return;
      } else {
        setSent(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const params = useParams();
  const resetPassword = async (password) => {
    const url = false;

    try {
      const response = await fetch(
        url ||
          `${import.meta.env.VITE_API_URL}/recovery/${params.id}/${
            params.token
          }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { sendEmail, resetPassword };
};
