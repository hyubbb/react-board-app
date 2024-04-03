import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { imageToServer } from "../actions/posts";
import ImageResize from "quill-image-resize";
import "react-quill/dist/quill.snow.css";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = ({ value, handleBody }) => {
  const quillRef = useRef(null); // Quill 인스턴스를 참조하기 위한 ref
  const [uploadedImages, setUploadedImages] = useState([]); // 업로드된 이미지 URL을 저장하기 위한 상태

  useEffect(() => {
    const handleUnload = async () => {
      // 업로드된 이미지 목록을 서버에서 삭제
      uploadedImages.forEach((imageUrl) => {
        imageToServer.delete(imageUrl);
      });
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [uploadedImages]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onclick = async (e) => {
      e.preventDefault();
      const file = input && input.files ? input.files[0] : null;
      const maxFileSize = 2 * 1024 * 1024;
      console.log(file.size, maxFileSize);
      if (file.size > maxFileSize) {
        alert("파일 크기가 너무 큽니다. 2MB 이하의 파일을 업로드해주세요.");
        return;
      }
      const imageUrl = await imageToServer.create(file);
      const editor = quillRef.current.getEditor();
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
          ["blockquote", "code-block"],
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
      <div className='h-[300px]'>
        <ReactQuill
          ref={quillRef}
          className='h-[280px]'
          theme='snow'
          value={value}
          onChange={handleBody}
          placeholder='글의 내용을 작성 해주세요'
          formats={formats}
          modules={modules}
        />
      </div>
    </>
  );
};

export default TextEditor;
