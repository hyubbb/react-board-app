import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost } from "../../actions/posts";
import { selectedPost } from "../../modules/boardSlice";
import BackButton from "../commons/BackButton";

const PageEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // getState
  const postId = +useParams().id;
  const viewPost = useSelector(selectedPost, shallowEqual) || "";
  const [inputs, setInputs] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (viewPost) {
      setInputs({ ...viewPost, postId });
    }
  }, [viewPost, postId]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const addSubmit = (e) => {
    e.preventDefault();

    if (inputs.title !== "" && inputs.body !== "") {
      dispatch(updatePost(inputs)).then(() => {
        navigate(-1);
      });
    } else {
      alert("값을 입력하세요");
    }
  };

  if (!viewPost) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex justify-center'>
      <div className=' max-w-[800px] min-w-[500px] w-full mt-8'>
        <div className='my-5 font-bold text-2xl mb-12'>
          <h1>글 수정</h1>
        </div>
        <form
          id='form-group'
          className={"mt-10 flex flex-col justify-center"}
          onSubmit={(e) => e.preventDefault()}
        >
          {viewPost?.email === undefined ? (
            ""
          ) : (
            <>
              <label className='text-right'>
                작성자
                <div className='text-md mb-4 font-black text-right' id='email'>
                  {viewPost?.email}
                </div>
              </label>
            </>
          )}
          <div className='col-span-full pb-12'>
            <label
              htmlFor='title'
              className='block text-lg font-medium leading-6 text-gray-900'
            >
              제목
            </label>
            <div className='mt-2'>
              <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 '>
                <input
                  type='text'
                  name='title'
                  id='title'
                  value={inputs.title}
                  onChange={handleChange}
                  className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400  '
                  placeholder='text'
                />
              </div>
            </div>
          </div>
          <div className='col-span-full'>
            <label
              htmlFor='body'
              className='block text-lg font-medium leading-6 text-gray-900'
            >
              내용
            </label>
            <div className='mt-2'>
              <textarea
                name='body'
                id='body'
                rows='3'
                value={inputs.body}
                onChange={handleChange}
                placeholder='text'
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
              ></textarea>
            </div>
          </div>
        </form>

        <div className='flex justify-center mt-7'>
          <button
            type='button'
            className='border-2 border-solid border-black rounded w-24 mr-5'
            onClick={addSubmit}
          >
            submit
          </button>
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default PageEdit;
