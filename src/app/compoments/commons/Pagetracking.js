import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";

const Pagetracking = () => {
  const history = createBrowserHistory();
  const location = useLocation();
  const [locationKeys, setLocationKeys] = useState([]);

  useEffect(() => {
    const unlisten = history.listen(({ location, action }) => {
      if (action === "POP") {
        if (locationKeys[1] === location.key) {
          setLocationKeys(([_, ...keys]) => keys);
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          if (location.pathname.includes("/edit")) {
            alert("뒤로가기 할 수 없는 페이지 입니다.");
            history.push(`/board/${location.pathname.split("/")[2]}`);
          }
        }
      }
      // }
    });

    // history.block((location, action) => {
    //   if (action === "POP" && location.pathname.includes("/edit")) {
    //     // 뒤로 가기를 차단하고 싶다면 true를 반환합니다.
    //     // 또한 사용자에게 어떤 경고 메시지를 보여줄 수도 있습니다.
    //     window.alert("You cannot go back from an edit page!");
    //     return true;
    //   }
    // });
  }, []);

  // const dispatch = useDispatch(); // getState
  // useEffect(() => {
  //   dispatch(fetchLogin(1));
  // }, [dispatch]);

  // const location = useLocation();
  // const navigate = useNavigate();
  // const [locationKey, setLocationKey] = useState({
  //   data: [],
  //   block: null,
  // });

  // useEffect(() => {
  //   if (location.pathname === locationKey.data[1]) {
  //     console.log("se");
  //     if (location.pathname.includes("edit")) {
  //       setLocationKey({
  //         data: [location.pathname, ...locationKey.data],
  //         block: true,
  //       });
  //       navigate(`/board/${location.pathname.split("/")[2]}`);
  //     }
  //   }

  //   setLocationKey({
  //     ...locationKey,
  //     data: [location.pathname, ...locationKey.data],
  //   });
  // }, [location, navigate]);
};

export default Pagetracking;
