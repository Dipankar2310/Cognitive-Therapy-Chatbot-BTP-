import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios'
import styles from "../../CSSFiles/BlogPage.module.scss";

export const BlogPage = (props: any) => {
  const [blogs, setBlogs] = useState<{ title: string; description: string; }[]>([]);
  const [helpTextValue, setHelpTextValue] = useState<string>("mental illness");

  const getBlogs = async() => {
    const res = await axios.get('http://localhost:8080/', {
      params: {
        searchText: helpTextValue,
      }
    });
    return res.data.result
  };

  useEffect(() => {
    setHelpTextValue(props.helpText)
  }, [])

  useEffect(() => {
    console.log('the helpText in BlogPage is: ', props.helpText)
    getBlogs().then((response) => {
      setBlogs(response)
    })
  }, [helpTextValue])

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
