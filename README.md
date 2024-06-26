# 게시판 - aws서버 복구중

https://port-0-react-board-app-754g42alujvb2sj.sel5.cloudtype.app/

 

![board](https://github.com/hyubbb/react-board-app/assets/32926006/01d9cd4c-bc9e-4503-a3a1-224ee6922045)


---

<br>

## 사용된 스택과 라이브러리
react, redux, tailwindcss, expressjs, firebase,  
redux-thunk, react-pagination, react-quill, react-persist

<br>

## 설명  
  
- `React-Redux`를 이용하여 복잡한 비동기 데이터 처리를 마스터하고 사용자 경험을 향상시키기 위해 구현된 게시판입니다. 
- 직접 `aws-ec2`서버와의 데이터 교환 과정을 통해, 데이터의 흐름과 처리 방식에 대한 이해를 목표로 진행했습니다. 
  이를 통해, 실제 서버 기반 애플리케이션의 백엔드와 프론트엔드 간의 상호작용을 경험했습니다.
- 코드의 유지보수성과 가독성을 높이기 위해, 컴포넌트 구조를 적용하여 체계적으로 관리하고자 하였습니다.
- 기본적인 CRUD 기능(게시글 작성, 수정, 삭제 및 댓글 작성, 수정, 삭제)을 포함하였습니다.  

<br>

## 기능  
   
- 비동기 데이터 처리를 위해서 `React-Redux`를 사용하여 데이터 상태 관리
 - 다른선택지들도 있었지만, 기본적인 비동기의 흐름에 익숙해지기 위해서 Redux를 선택하였습니다. 
- `React-Persist` 를 활용하여 웹 브라우저의 localStorage에 데이터를 저장하고 관리하여 세션간의 상태유지를 가능하게 했습니다.
  - redux의 특성상 새로고침하면 데이터가 초기화 되기 때문에, 상태를 유지해주고자 사용하였습니다.
- `React-Quill` 에디터를 이용해서 다양한 텍스트옵션을 제공하여, 풍부한 게시글 작성이 용이.
    - 글 작성시 이미지 미리 보기를 구현하기 위해서 서버에 업로드 후, 이미지 주소를 불러오며, 글작성 취소 시 서버데이터 삭제가 이루어집니다.
- `Expressjs`를 활용하여 백엔드 서버 구측, 데이터 관리 및 처리 로직을 구현
    - 서버는 aws-ec2를 이용, 데이터베이스는 rds-mysql을 사용하였습니다.
- `Axios`를 이용하여 CRUD 기능 구현
- `Firebase`를 이용힌 손쉬운 구글 계정 로그인 기능 구현 및 회원가입 기능으로 사용자의 접근성 향상
- `React-pagination` 을 이용하여 페이지네이션 적용  
