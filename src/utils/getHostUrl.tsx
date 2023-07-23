const getHostUrl = () => {
  const h = window.sessionStorage.getItem("hostUrl");
  return h ? h : "";
};

export default getHostUrl;
