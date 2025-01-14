/* eslint-disable react/prop-types */
import { useAuth } from "./auth/authContext";

export const DeleteEntryModal = ({ entry, selected, fetchData }) => {
  const { user } = useAuth();

  const deleteEntry = async () => {
    try {
      if (!user) throw new Error("user not yet available");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/weight-entry/delete/${entry.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }
      fetchData();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <>
      <dialog id="delete_entry_modal" className="modal">
        {
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{selected?.name}</h3>

            <div className="flex justify-center font-bold">
              Are you sure you want to delete this entry:
            </div>
            <div className="flex justify-center font-bold">
              {entry?.date.split("T")[0]} {entry?.weight + "lbs"}
            </div>

            <div className="modal-action ">
              <form method="dialog">
                <div className="flex gap-2">
                  <button className="btn">Discard</button>
                  {selected && (
                    <button
                      className="btn bg-red-500 text-white px-6"
                      onClick={deleteEntry}
                    >
                      delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        }
      </dialog>
    </>
  );
};
