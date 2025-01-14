import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/authContext";

export const DeleteModal = () => {
  const { user, logout } = useAuth();
  let navigate = useNavigate();

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error("user not yet available");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {

        throw new Error("Login failed");
      }

      logout();
      navigate('/')
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <>
      <dialog id="my_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Are you sure you want to delete your account? </p>
          <p className="py-4 text-red-600">
            All data will be lost, this is irreversible.{" "}
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <div className="flex gap-2">
                <button className="btn">
                  No, I want to keep getting bigger
                </button>
                <button
                  className="btn bg-red-600 text-white"
                  onClick={deleteAccount}
                >
                  Yes, I give up
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
