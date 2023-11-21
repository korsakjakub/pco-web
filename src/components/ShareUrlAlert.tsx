import { useState } from "react";

interface Props {
  url: string;
  queueId: string;
}

const ShareUrlAlert = ({ url, queueId }: Props) => {
  const getShareUrl = () => {
    return url + "/join/" + queueId;
  };

  const [showShareLink, setShowShareLink] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => {
        setShowShareLink(true);
        navigator.clipboard.writeText(getShareUrl());
      }}>
        Share 
      </button>
      {showShareLink && 
        <a href={getShareUrl()}>link</a>
      }
    </>
  );
};

export default ShareUrlAlert;
