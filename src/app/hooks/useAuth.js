import { useSelector } from "react-redux";

export const useAuth = () => {
  const { id, email, photo, name } = useSelector((state) => state.users);
  return {
    isAuth: !!email,
    email,
    id,
    photo,
    name,
  };
};
