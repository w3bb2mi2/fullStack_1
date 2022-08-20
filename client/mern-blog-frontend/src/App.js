import Container from "@mui/material/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { TagsPosts } from "./pages/TagsPosts";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
  
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth)
  useEffect(()=>{
    dispatch(fetchAuthMe())
  },[])
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/post/:id/edit" element={<AddPost />} />
          {/* <Route path="/tags/:tagsName" element={<TagsPosts />} /> */}
          <Route path="/tags/:tagName" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
