import React from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsPage } from "../../actions/posts.js";
import "./pagination.css";
import { selectPosts } from "../../modules/boardSlice.js";
const Pagination = () => {
  const dispatch = useDispatch(); // getState
  const postData = useSelector(selectPosts);
  // const { totalCount = 10, pageNum = 0 } = postData;
  // const pageData = postData;
  const totalCount = postData?.totalCount || 10;
  const pageNum = postData?.pageNum || 0;
  const itemsPerPage = 10;
  const pageCount = Math.ceil(totalCount / itemsPerPage);
  console.log(pageNum);
  const handlePageClick = (event) => {
    dispatch(fetchPostsPage({ page: event.selected + 1, limit: itemsPerPage }));
  };
  return (
    <>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={0}
        breakLabel={""}
        previousLabel={"<"}
        // forcePage={pageNum}
        nextLabel={">"}
        onPageChange={handlePageClick}
        containerClassName={"pagination-ul"}
        activeClassName={"currentPage"}
        previousClassName={"pageLabel-btn"}
        nextClassName={"pageLabel-btn"}
      />
    </>
  );
};

export default Pagination;
