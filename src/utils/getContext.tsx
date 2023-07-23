const getContext = () => {
const ctxJSON = window.sessionStorage.getItem('ctx');
if (ctxJSON === null)
    return;
return JSON.parse(ctxJSON);
}

export default getContext;