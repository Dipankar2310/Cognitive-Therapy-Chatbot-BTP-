import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios'
import styles from "../../CSSFiles/BlogPage.module.scss";

export const BlogPage = () => {
  const [blogs, setBlogs] = useState<{ title: string; description: string; }[]>([]);

  const getBlogs = async() => {
    const res = await axios.get('http://localhost:8080/');
    return res.data.result
  };

  useEffect(() => {
    console.log(blogs);
  }, [blogs])

  useEffect(() => {
    getBlogs().then((response) => {
      setBlogs(response)
    })
  }, [])

  return(
    <>
      <div className={styles.blogs}>
        <div className={styles.blogstitle}>
          Recommanded Blogs
        </div>
      {blogs.map((blog, index) => (
          <div key={index} className={styles.blogcard}>
            <div className={styles.title}>{blog.title}</div>
            <div>{blog.description}</div>
          </div>
        ))}
      </div>
    </>
  )
};
