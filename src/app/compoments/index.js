import React, { useState } from "react";
import PageList from "./page/PageList.js";
import Pagination from "./commons/Pagination.js";
import { useSelector } from "react-redux";
import { selectPosts } from "../modules/boardSlice.js";

const Container = () => {
  const postData = useSelector(selectPosts);
  const { totalCount: totalCnt } = postData;
  const itemsPerPage = 10;
  const [pageNum, setPageNum] = useState(0);

  return (
    <>
      <PageList
        postData={postData}
        itemsPerPage={itemsPerPage}
        pageNum={pageNum}
      />
      <Pagination
        itemsPerPage={itemsPerPage}
        totalCount={totalCnt}
        pageNum={pageNum}
        setPageNum={setPageNum}
      />
    </>
  );
};

export default Container;
