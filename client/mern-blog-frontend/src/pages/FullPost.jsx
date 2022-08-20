import React from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../redux/axios";
import ReactMarkdown from 'react-markdown'
//import axios from "..";

export const FullPost = () => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:5000/post/${id}`)
      .then(el => { setData(el.data); setIsLoading(false) })
      .catch(err => {
        console.warn(err)
        alert(err)
      })
  }, [])



  if (isLoading) {
    return <Post isLoading={isLoading} />
  }
  console.log({ data })

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={`http://localhost:5000${data.imageUrl}`}
        user={{
          avatarUrl: data.imageUrl,
          fullName: data.fullName,
        }}
        createdAt={"12 июня 2022 г."}
        viewsCount={data.viewCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>
          <ReactMarkdown children={data.text} />
        </p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
