/* eslint-disable react/prop-types */
import { useAuth } from "./auth/authContext";

export const DeleteEntryModal = ({ entry, selected, fetchData }) => {
  const { user } = useAuth();

  const deleteEntry = async () => {
    try {
      // Validate entry exists
      if (!entry || !entry.id) {
        throw new Error("No weight entry selected for deletion");
      }

      // Verify user is logged in
      if (!user) {
        throw new Error("You must be logged in to delete entries");
      }

      // Ensure the ID is a valid number
      const entryId = parseInt(entry.id);
      if (isNaN(entryId)) {
        throw new Error("Invalid entry ID format");
      }

      console.log("Deleting weight entry:", entryId);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/weight-entry/delete/${entryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Add auth token if needed
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error:", errorData);
        throw new Error(errorData.error || "Delete failed");
      }

      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed: " + error.message);
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
