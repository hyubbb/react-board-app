import React from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsPage } from "../../actions/posts";
import { getPageNum, setPageNum } from "../../modules/boardSlice";
import "./pagination.css";
const Pagination = ({ itemsPerPage, totalCount }) => {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const dispatch = useDispatch(); // getState
  const pageNum = useSelector(getPageNum);
  const pageCount = Math.ceil(totalCount / itemsPerPage);

  const handlePageClick = (event) => {
    dispatch(fetchPostsPage(event.selected + 1, itemsPerPage));
    dispatch(setPageNum(event.selected));
  };
  return (
    <>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={4}
        marginPagesDisplayed={0}
        breakLabel={"..."}
        previousLabel={"<"}
        forcePage={pageNum}
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
