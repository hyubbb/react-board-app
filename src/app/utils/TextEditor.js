import React, { useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill, { Quill } from "react-quill";
import { imageToServer } from "../actions/posts";
import ImageResize from "quill-image-resize";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = ({ value, handleBody }) => {
  const quillRef = useRef(null); // Quill 인스턴스를 참조하기 위한 ref
  const [uploadedImages, setUploadedImages] = useState([]); // 업로드된 이미지 URL을 저장하기 위한 상태

  useEffect(() => {
    const handleBeforeUnload = async () => {
      // 업로드된 이미지 목록을 서버에서 삭제
      uploadedImages.forEach((imageUrl) => {
        imageToServer.delete(imageUrl);
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uploadedImages]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async (e) => {
      e.preventDefault();
      const file = input && input.files ? input.files[0] : null;
      const imageUrl = await imageToServer.create(file);
      // console.log(imageUrl);
      const q = quillRef.current;
      const editor = q.getEditor();
      const range = editor.getSelection();

      if (editor && range) {
        editor.insertEmbed(range.index, "image", imageUrl);
        setUploadedImages((prevImages) => [...prevImages, imageUrl]);
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
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
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
