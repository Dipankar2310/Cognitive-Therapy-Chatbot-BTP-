import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios'
import styles from "../../CSSFiles/BlogPage.module.scss";
import { HiOutlineExternalLink } from 'react-icons/hi';
import { child, get, getDatabase, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


export const BlogPage = (props: any) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAzqB8sbcmuDBo6eMsmjWY84RIAQ_3s6sA",
    authDomain: "healthgpt-1a9b2.firebaseapp.com",
    databaseURL: "https://healthgpt-1a9b2-default-rtdb.firebaseio.com",
    projectId: "healthgpt-1a9b2",
    storageBucket: "healthgpt-1a9b2.appspot.com",
    messagingSenderId: "431429000193",
    appId: "1:431429000193:web:799ed9852f1fbed9eaf400",
    measurementId: "G-E7Z9SS8BD2"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  const dbRef = ref(database);
  const user = auth.currentUser;
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

  
  const getData = async () => {
    get(child(dbRef, `users/${user?.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const res = snapshot.val();
          console.log(res.userhelptype)
          setHelpTextValue(res.userhelptype);
        }
      })
      .catch((error) => {

      });
  };

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    console.log('the helpText in BlogPage is: ', helpTextValue)
    getBlogs(helpTextValue).then((response) => {
      setBlogs(response)
    })
  }, [helpTextValue])

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
