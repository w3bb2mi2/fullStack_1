import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostsByTags, fetchTags, fetchTagsSortedByLatest, fetchTagsSortedByviews } from '../redux/slices/post.js';
import { useParams } from 'react-router-dom';
export const TagsPosts = () => {
  const [value, setValue] = useState(3)
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth)
  const { posts, tags } = useSelector(state => state.posts)
  const isPostLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  const { tagsName } = useParams()


  useEffect(() => {
    dispatch(fetchTags())

    dispatch(fetchPostsByTags({tags: "cola"}))


  }, [])

  console.log("Загрузка страницы")
  const handleChange = async (event, newValue) => {
    if (newValue === 0) {
      await dispatch(fetchTagsSortedByLatest())
    }
    if (newValue === 1) {
      await dispatch(fetchTagsSortedByviews())
    }
    setValue(newValue)
    console.log(value)

  }
  return (
    <>
      <Tabs
        onChange={handleChange}
        style={{ marginBottom: 15 }}
        value={value}
        aria-label="basic tabs example">
        <Tab label="Новые"
          value={0}
        />
        <Tab label="Популярные"
          value={1}
        />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [Array(5)] : posts.items).map((elem, index) => (
            isPostLoading ?
              <Post
                key={index} isLoading="true"
              /> :
              <Post
                id={elem._id}
                title={elem.title}
                imageUrl={elem.imageUrl ? `http://localhost:5000${elem.imageUrl}` : ""}
                user={{
                  avatarUrl: `http://localhost:5000${elem.imageUrl}`,
                  fullName: elem.user?.fullName,
                }}
                createdAt={elem.createdAt}
                viewsCount={elem.viewCount}
                commentsCount={3}
                tags={posts.items[index].tags}
                // isLoading={true}
                isEditable={userData.data && userData.data._id === elem.user._id}
              />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: posts.avatarUrl
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
