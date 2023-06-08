import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import styles from "../../CSSFiles/BlogPage.module.scss";
import { HiOutlineExternalLink } from "react-icons/hi";
import { stringify } from "querystring";

export const BlogPage = (props: any) => {
  const [blogs, setBlogs] = useState<
    {
      urlToImage: string;
      title: string;
      description: string;
      author: string;
      url: string;
    }[]
  >([]);

  const getBlogs = async (searchQuery: any, numberOfResults: any) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/news/news?searchQuery=${searchQuery}&numberOfResults=${numberOfResults}`
      );
      return res.data.data.articles;
    } catch (error) {
      console.log(error);
    }
  };

  const getSymptom = async (userId: any, accessToken: any) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/db/symptom?userId=${userId}&accessToken=${accessToken}`
      );
      return res.data.data.symptom;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");

    if (userId) {
      getSymptom(userId, accessToken).then((response) => {
        getBlogs(response, 5).then((response) => {
          setBlogs(response);
        });
      });
    } else {
      getBlogs("autism", 5).then((response) => {
        console.log(response);
        setBlogs(response);
      });
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.blogstitle}>Recommended Blogs</div>
        <div className={styles.blogContainer}>
          <div className={styles.blogs}>
            {blogs.map((blog, index) => (
              <a
                key={index}
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.blogcard}
              >
                <img src={blog.urlToImage} alt={blog.title} />
                <div className={styles.title}>{blog.title}</div>
                <div className={styles.description}>{blog.description}</div>
                <div className={styles.author}>
                  {blog.author || "Anonymous"}
                  <HiOutlineExternalLink className={styles.redirectIcon} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
