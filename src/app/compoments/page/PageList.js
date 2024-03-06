import React, { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPostsPage } from "../../actions/posts.js";
import { commentRemove, postViewRemove } from "../../modules/boardSlice.js";
import { useAuth } from "../../hooks/useAuth.js";

const PageList = memo(({ postData, itemsPerPage, pageNum = 0 }) => {
  const { data: posts, totalCount: totalCnt } = postData;
  const dispatch = useDispatch(); // getState
  const { isAuth } = useAuth();
  useEffect(() => {
    dispatch(fetchPostsPage({ page: pageNum + 1, limit: itemsPerPage }));
    dispatch(postViewRemove());
    dispatch(commentRemove());
  }, [dispatch, itemsPerPage]);

  return (
    <div className='flex items-center flex-col'>
      <div className=' max-w-[1200px]  w-full mt-8'>
        <div className='my-5 font-bold text-2xl px-10'>
          <h1>게시판</h1>
        </div>
        <div className='flex flex-col my-5 border-b-zinc-950 text-lg'>
          <ul className='flex py-4 mb-2 font-bold'>
            <li className='flex-[1_1_50px] text-center'>no</li>
            <li className='flex-[9_1_0]'>title</li>
            <li className='flex-[1_0_50px] text-center'>조회수</li>
            <li className='flex-[1_0_100px] text-center'>date</li>
          </ul>
          {posts?.length > 0 ? (
            posts.map((data, i) => {
              return (
                <div className='flex border-b-2 items-center' key={data.id}>
                  <div className='flex-[1] basis-[50px] text-center '>
                    {totalCnt - pageNum * 10 - i}
                  </div>
                  <Link
                    to={`/board/${data.id}`}
                    className='w-full h-[50px] flex flex-[9] items-center'
                  >
                    <div className='flex'>{data.title}</div>
                  </Link>
                  <div className='flex-[1] ml-auto basis-[50px] text-center'>
                    {data?.views}
                  </div>
                  <div className='flex-[1] ml-auto basis-[100px] text-center'>
                    {data?.createdAt?.substring(2, 10)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className='text-center text-xl'>작성 된 글이 없습니다.</div>
          )}
        </div>
        {isAuth && (
          <div className='flex justify-end text-center mr-4'>
            <Link
              to={`/create`}
              className='border-2 border-solid border-black rounded w-24'
            >
              글 작성
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

export default PageList;
