import React from "react";
import PageList from "./page/PageList.js";
import Pagination from "./commons/Pagination.js";
import { useSelector } from "react-redux";
import { selectPosts } from "../modules/boardSlice.js";

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
