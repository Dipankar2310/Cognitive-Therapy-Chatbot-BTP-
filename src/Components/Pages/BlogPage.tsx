import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from 'axios'

export const BlogPage = () => {
  const location = useLocation();
  const { state } = location;
  console.log(state);

  const getBlogs = async() => {
    const res = await axios.get('http://localhost:8080/');
    console.log(res.data.result);
  };

  useEffect(() => {
    getBlogs();
  }, [])

  return <>Blog</>;
};
