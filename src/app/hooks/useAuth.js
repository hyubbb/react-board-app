import { useSelector } from "react-redux";

export const useAuth = () => {
  const { id, email, photo, name } = useSelector((state) => state.users);
  const admin = id === "dlckdguq1011@gmail.com";
  return {
    isAuth: !!email,
    email,
    id,
    photo,
    name,
    admin,
  };
};
