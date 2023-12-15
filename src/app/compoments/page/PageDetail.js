import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectedPost } from "../../modules/boardSlice";
import BackButton from "../commons/BackButton";
import PageDelete from "../page/PageDelete";
import CommentList from "../comment/CommentList";
import { fetchPostAndIncreaseViews } from "../../actions/posts";
import { selectUser } from "../../modules/userSlice";

const PageDetail = () => {
  const postId = +useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewPost = useSelector(selectedPost, shallowEqual) || "";
  const users = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchPostAndIncreaseViews(postId));
  }, [dispatch, postId]);

  console.log(viewPost);
  function isNumeric(str) {
    return /^\d+$/.test(str);
  }

  if (!isNumeric(postId)) {
    // 숫자가 아닌 경우 메인 화면으로 이동
    navigate(`/`);
    return null;
  }

  return (
    <div className='flex justify-center items-center flex-col mt-16'>
      <div className=' max-w-[1200px] min-w-[500px] w-full px-10 mb-24'>
        <div className='text-lg mb-10 font-black border-b-2 flex pb-6'>
          {viewPost.title}
          <div className='ml-auto'>{viewPost?.views}</div>
        </div>

        {viewPost?.email}
        <div className='text-md mb-4 font-black text-right'></div>

        <div
          className='flex-0 border-b-2 pb-20'
          dangerouslySetInnerHTML={{ __html: viewPost.body }}
        ></div>

        <div className='flex justify-center mt-7'>
          <BackButton />

          {users.id !== undefined && viewPost.userId === users.id ? (
            <>
              <Link
                to={`/edit/${postId}`}
                state={{ post: viewPost, postKey: postId }}
                className='border-2 border-solid border-black rounded w-24 mr-5 text-center'
              >
                edit
              </Link>
              <PageDelete postId={postId} />
            </>
          ) : (
            // ""
            <>
              <Link
                to={`/edit/${postId}`}
                state={{ post: viewPost, postKey: postId }}
                className='border-2 border-solid border-black rounded w-24 mr-5 text-center'
              >
                edit
              </Link>
              <PageDelete postId={postId} />
            </>
          )}
        </div>
        <CommentList />
      </div>
    </div>
  );
};

export default React.memo(PageDetail);
