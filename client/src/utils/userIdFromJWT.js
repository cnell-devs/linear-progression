import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (
  token = localStorage.getItem("authToken")
) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const userCheckNoId = async (id) => {
  try {
    const data = await fetch(`/api/post/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    const json = await data.json();

    id = await json.authorId;

    return getUserIdFromToken() === id;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const userCheck = (id) => {
  return getUserIdFromToken() === id;
};
