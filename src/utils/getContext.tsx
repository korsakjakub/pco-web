const getContext = () => {
  const ctxJSON = window.sessionStorage.getItem("ctx");
  if (ctxJSON === null) throw new Error("Context not found in session storage")
  return JSON.parse(ctxJSON);
};

export default getContext;
