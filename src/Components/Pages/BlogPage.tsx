import { useLocation } from "react-router-dom";
export const BlogPage = () => {
  const location = useLocation();
  const { state } = location;
  console.log(state);
  return <>Blog</>;
};
