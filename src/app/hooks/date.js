import React from "react";

const DateFormat = () => {
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}.${mm}.${dd} ${hh}:${min} ${ss}`;
  };

  const currentTime = new Date();
  const createdAt = formatDate(currentTime);
  return createdAt;
};

export default DateFormat;
