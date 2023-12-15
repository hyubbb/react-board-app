import React from "react";
import Container from "./app/compoments";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Pagetracking from "./app/compoments/commons/Pagetracking";
import Footer from "./app/compoments/commons/Footer";
import Navbar from "./app/compoments/commons/Navbar";
import PageDetail from "./app/compoments/page/PageDetail";
import PageCreate from "./app/compoments/page/PageCreate";
import PageEdit from "./app/compoments/page/PageEdit";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
