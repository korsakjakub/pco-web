const getFrontUrl = () => {
  const h = window.sessionStorage.getItem("frontUrl");
  return h ? h : "";
};

export default getFrontUrl;
