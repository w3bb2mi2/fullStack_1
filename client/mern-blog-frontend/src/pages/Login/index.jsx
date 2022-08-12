import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form'
import styles from "./Login.module.scss";
import {Navigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";


export const Login = () => {
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: 'w3bbwmi2@gmail.com',
      password: '123456'
    }, mode:'onSubmit'
  })
  const dispatch = useDispatch()

  const onSubmit = async (values) => {
    console.log(values)
    const data = await dispatch(fetchAuth(values));
    if(!data.payload){
      alert('Не удалось авторизоваться')
    }

    if('token' in data.payload){
      window.localStorage.setItem('token', data.payload.token)
      console.log(localStorage.getItem('token'))
    }
  }  
  // вытаскиваем значение из стэйта. используя функцию, написанную и экспортированную сюда из файла со слайсом
  const isAuth = useSelector(selectIsAuth)
  if(isAuth){
    return <Navigate to="/"/>
  }

 
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          
          type={"email"}
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
          {...register("email", {required:"укажите форму"})}
        />
        <TextField className={styles.field}  
          
          {...register("password", {required:"укажите пароль"})} 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          label="Пароль" 
          fullWidth />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
