import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";

const Pagetracking = () => {
  const history = createBrowserHistory();
  const location = useLocation();
  const [locationKeys, setLocationKeys] = useState([]);

  useEffect(() => {
    history.listen(({ location, action }) => {
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
  }, []);
};

export default Pagetracking;
