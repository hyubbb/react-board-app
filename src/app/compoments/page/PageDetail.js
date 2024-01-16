import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectedPost } from "../../modules/boardSlice.js";
import BackButton from "../commons/BackButton.js";
import PageDelete from "../page/PageDelete.js";
import CommentList from "../comment/CommentList.js";
import { fetchPostView } from "../../actions/posts.js";
import { selectUser } from "../../modules/userSlice.js";

const PageDetail = () => {
  const postId = +useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewPost = useSelector(selectedPost, shallowEqual) || "";
  const users = useSelector(selectUser);
  useEffect(() => {
    dispatch(fetchPostView(postId));
  }, [dispatch, postId]);

  function isNumeric(str) {
    return /^\d+$/.test(str);
  }

  if (!isNumeric(postId)) {
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