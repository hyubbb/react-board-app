import React from "react";
import Container from "./app/compoments/index.js";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Pagetracking from "./app/compoments/commons/Pagetracking.js";
import Footer from "./app/compoments/commons/Footer.js";
import Navbar from "./app/compoments/commons/Navbar.js";
import PageDetail from "./app/compoments/page/PageDetail.js";
import PageCreate from "./app/compoments/page/PageCreate.js";
import PageEdit from "./app/compoments/page/PageEdit.js";
import RegisterPage from "./app/compoments/page/UserPage/RegisterPage/RegisterPage.js";
import LoginPage from "./app/compoments/page/UserPage/RegisterPage/LoginPage.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Pagetracking />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Container />} />
          <Route path='/board/:id' element={<PageDetail />} />
          <Route path='/create' element={<PageCreate />} />
          <Route path='/edit/:id' element={<PageEdit />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />

          {/* <Route path='login' element={<LoginPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
