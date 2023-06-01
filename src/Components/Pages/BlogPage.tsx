import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import axios from 'axios'
import styles from "../../CSSFiles/BlogPage.module.scss";
import { HiOutlineExternalLink } from 'react-icons/hi';


export const BlogPage = (props: any) => {
  const [blogs, setBlogs] = useState<{urlToImage:string;  title: string; description: string; author:string; url:string; }[]>([]);
  const [helpTextValue, setHelpTextValue] = useState<string>("mental health");

  const getBlogs = async(searchValue: any) => {
    const res = await axios.get('http://localhost:8080/', {
      params: {
        searchText: searchValue,
      }
    });
    return res.data.result
  };

  useEffect(() => {
    setHelpTextValue(props.helpText)
  }, [props.helpText])


  useEffect(() => {
    console.log('the helpText in BlogPage is: ', props.helpText)
    getBlogs(props.helpText).then((response) => {
      setBlogs(response)
    })
  }, [props.helpText])

  return(
    <>
  
  <div className={styles.blogstitle}>Recommended Blogs</div>
  <div className={styles.blogs}>
  {blogs.map((blog, index) => (
    <a key={index} href={blog.url} target="_blank" rel="noopener noreferrer" className={styles.blogcard}>
      <img src={blog.urlToImage} alt={blog.title} />
      <div className={styles.title}>{blog.title}</div>
      <div className={styles.description}>{blog.description}</div>
      <div className={styles.author}>{blog.author}
      <HiOutlineExternalLink className={styles.redirectIcon} />
      </div>
    </a>
  ))}
</div>

    </>
  )
};
