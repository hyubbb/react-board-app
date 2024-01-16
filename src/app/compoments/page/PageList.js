import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPostsPage } from "../../actions/posts.js";
import { getPageNum } from "../../modules/boardSlice.js";

const PageList = ({ postData, itemsPerPage }) => {
  const { data: posts, totalCount: totalCnt } = postData;
  const dispatch = useDispatch(); // getState
  const pageNum = useSelector(getPageNum);
  useEffect(() => {
    dispatch(fetchPostsPage({ page: pageNum + 1, limit: itemsPerPage }));
    // dispatch(fetchPostsPage(pageNum + 1, 10));
  }, [dispatch, pageNum, itemsPerPage]);

  if (!posts?.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='flex items-center flex-col'>
        <div className=' max-w-[1200px] min-w-[500px] w-full mt-8'>
          <div className='my-5 font-bold text-2xl px-10'>
            <h1>게시판</h1>
          </div>
          <div className='flex flex-col my-5 border-b-zinc-950 text-lg'>
            <ul className='flex py-4 mb-2 font-bold'>
              <li className='basis-[100px] text-center'>no</li>
              <li className='flex-1'>title</li>
              <li className='basis-[50px] text-center'>조회수</li>
              <li className='basis-[150px] text-center'>date</li>
            </ul>
            {posts.map((data, i) => {
              return (
                <div className='flex border-b-2 items-center' key={data.id}>
                  <div className='basis-[100px] text-center '>
                    {totalCnt - pageNum * 10 - i}
                  </div>
                  <Link
                    to={`/board/${data.id}`}
                    className='w-full h-[50px] flex items-center'
                  >
                    <div className='grow'>{data.title}</div>
                  </Link>
                  <div className='ml-auto basis-[50px] text-center'>
                    {data?.views}
                  </div>
                  <div className='ml-auto basis-[150px] text-center'>
                    {data?.createdAt?.substring(2, 10)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className='flex justify-end text-center mr-4'>
            <Link
              to={`/create`}
              className='border-2 border-solid border-black rounded w-24'
            >
              글 작성
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageList;
