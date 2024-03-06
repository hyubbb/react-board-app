import React, { useCallback } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { fetchPostsPage } from "../../actions/posts.js";
import "./pagination.css";
const Pagination = ({ itemsPerPage = 10, totalCount, pageNum }) => {
  const dispatch = useDispatch(); // getState
  // const pageNum = useSelector(getPageNum);
  const pageCount = Math.ceil(totalCount / itemsPerPage);
  const handlePageClick = useCallback(
    (event) => {
      dispatch(
        fetchPostsPage({ page: event.selected + 1, limit: itemsPerPage })
      );
    },
    [dispatch, itemsPerPage]
  );
  return (
    <>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={0}
        breakLabel={""}
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
