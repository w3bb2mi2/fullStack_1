import React, { useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../redux/axios'
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

export const AddPost = () => {
  const { id } = useParams()
  console.log({ id })
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('');
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState('')
  const inputFileRef = useRef("null")
  console.log({ text }, { title }, { tags })

  useEffect(() => {
    if (id) {
      axios.get(`/post/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setText(data.text)
          setImageUrl(data.imageUrl)
          setTags(data.tags)
        })
    }
  }, [])

  const isEditing = Boolean(id)

  //функция повешена на инпут, в случае загрузки она сработает
  const handleChangeFile = async (event) => {
    console.log("Выбор файла")
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (error) {

    }
  };

  const onSubmit = async () => {
    try {
      console.log("Отправка данных на сервер...")
      setIsLoading(true)
      const fields = {
        title,
        text,
        tags: tags.split(","),
        imageUrl
      }

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)
      const _id = isEditing
        ? id
        :data.post._id
      console.log(data)
      navigate(`/post/${_id}`)
    } catch (error) {
      console.log(error)
    }
  }

  const onClickRemoveImage = () => {
    setImageUrl("")
  };

  const onChange = React.useCallback((value) => {
    setText(value);

  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => {
          inputFileRef.current.click()
        }}
        variant="outlined"
        size="large">
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:5000${imageUrl}`}
            alt="Uploaded" />
        </>
      )}

      <br />
      <br />
      <TextField
        onChange={e => setTitle(e.target.value)}
        value={title}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        value={tags}
        onChange={e => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={e => onChange(e)} options={options} />
      <div className={styles.buttons}>
        <Button
          onClick={onSubmit}
          size="large"
          variant="contained">
          {id ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
