import React from "react";
import PageList from "./page/PageList";
import Pagination from "./commons/Pagination";
import { useSelector } from "react-redux";
import { selectPosts } from "../modules/boardSlice";

// import PageCreate from "./PageCreate";

const Container = () => {
  const postData = useSelector(selectPosts);
  const { totalCount: totalCnt } = postData;
  const itemsPerPage = 10;
  return (
    <>
      <PageList postData={postData} itemsPerPage={itemsPerPage} />
      <Pagination itemsPerPage={itemsPerPage} totalCount={totalCnt} />
    </>
  );
};

export default Container;
