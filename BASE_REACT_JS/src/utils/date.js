import moment from "moment";

const formatDate = (timeStamp) => {
  if (!new Date(timeStamp).getTime() > 0) return "";
  return moment(timeStamp).format("DD/MM/YYYY");
};

const formatDateTime = (timeStamp) => {
  if (!new Date(timeStamp).getTime() > 0) return "";
  return moment(timeStamp).format("HH:mm DD/MM/YYYY");
};

const formatDateTimeSecond = (timeStamp) => {
  if (!new Date(timeStamp).getTime() > 0) return "";
  return moment(timeStamp).format("HH:mm:ss DD/MM/YYYY");
};

const formatDateTimeString = (time) => {
  if (!new Date(time).getTime() > 0) return "";

  const currentTime = Math.ceil(Date.now() / 1000);
  const formatTime = parseInt(moment(time).format("X"), 10);

  if (currentTime > formatTime && currentTime - formatTime < 3600)
    return `${Math.ceil((currentTime - formatTime) / 60)} phút trước`;

  return moment(time).format("HH:mm DD/MM/YYYY");
};

export { formatDateTime, formatDateTimeString, formatDate, formatDateTimeSecond };
