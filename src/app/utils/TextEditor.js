import React, { useMemo, useRef } from "react";
// import { Container } from "./TextEditor.styles";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill";
import { split } from "postcss/lib/list";
// import { imageToServer } from "../actions/posts";

const TextEditor = ({ value, handleBody }) => {
  const quillRef = useRef(null); // Quill 인스턴스를 참조하기 위한 ref

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input && input.files ? input.files[0] : null;
      const imageUrl = URL.createObjectURL(file); // 파일에 대한 임시 URL 생성

      const a = imageUrl.split("blob:")[1];
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   console.log(e.target.result);
      // };

      // reader.readAsDataURL(file);

      // console.log(file);
      // const imageUrl = await imageToServer.create(file);
      const q = quillRef.current;
      const editor = q.getEditor();
      const range = editor.getSelection();

      if (editor && range) {
        editor.insertEmbed(range.index, "image", a);
        // setUploadedImages((prevImages) => [...prevImages, imageUrl]);
      }
    };
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "image",
    "blockquote",
    "code-block",
  ];

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ list: "ordered" }, { list: "bullet" }],
          [],
          ["italic", "underline", "strike"],
          [],
          [{ color: [] }, { background: [] }],
          [],
          ["image", "blockquote", "code-block"],
        ],
        handlers: {
          // image: imageHandler,
        },
      },
    };
  }, []);

  return (
    <>
      {/* <Container> */}
      <div className='h-[300px]'>
        <ReactQuill
          ref={quillRef}
          className='h-[280px]'
          theme='snow'
          value={value}
          onChange={handleBody}
          placeholder='Write notes...'
          formats={formats}
          modules={modules}
        />
      </div>
      {/* </Container> */}
    </>
  );
};

export default TextEditor;
