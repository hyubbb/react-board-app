import React from "react";
// import { Container } from "./TextEditor.styles";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
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

const modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    [],
    ["italic", "underline", "strike"],
    [],
    [{ color: [] }, { background: [] }],
    [],
    ["image", "blockquote", "code-block"],
  ],
};

const TextEditor = ({ value, handleBody }) => {
  return (
    <>
      {/* <Container> */}
      <div className='h-[300px]'>
        <ReactQuill
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
