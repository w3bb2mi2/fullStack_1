import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import axios from '../../redux/axios'
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {  fetchRegistration, selectIsAuth } from '../../redux/slices/auth';

import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export const Registration = () => {
  //ссылка для input для аватарки
  const [avatarUrl, setAvatarUrl] = useState("")
  const avatarRef = useRef()
  const handleClick = () =>{
    avatarRef.current.click()
  }
  const getAvatarUrl = async(event) =>{
    console.log("Выбор файла")
    const file = event.target.files[0]
    
    const formData = new FormData()
    formData.append("image", file)
    const {data} = await axios.post("/upload", formData)
    setAvatarUrl(data.url)
    console.log("data.url", data.url)
    
  }

  const dispatch = useDispatch()
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName:"Валерия Ли",
      email: 'w3bbwmi2@gmail.com',
      password: '123456'
    }, mode:'onSubmit'
  })
  
  const onSubmit = async (value) => {
    const data = await dispatch(fetchRegistration(value))
    
    if (!data.payload) {
      
      return alert('Не удалось авторизоваться')
      
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }
  const isAuth = useSelector(selectIsAuth)
  
  if (isAuth) {
    return <Navigate to="/"/>
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите почту' })}
          //error={Boolean(errors.fullName?.message)}
          className={styles.field}
          label="Полное имя"

          fullWidth />
        <TextField
          {...register('email', { required: 'Укажите e-mail' })}
          helperText={errors.email?.message}
          error ={Boolean(errors.email?.message)}
          className={styles.field}
          label="E-Mail"
          fullWidth />
        <TextField
          {...register('password', { required: 'Укажите пароль' })}
          helperText={errors.password?.message}          
          error={Boolean(errors.password?.message)}
          className={styles.field}
          label="Пароль"
          fullWidth />
        <Button onClick={handleClick}>Добавить Аватарку</Button>
        <input 
          onChange={getAvatarUrl}
          hidden
          ref={avatarRef}
          type="file"/>
        <Button   type={'submit'} size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
