import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="share-url-alert">
      <button type="button" onClick={() => {
        setShowShareLink(!showShareLink);
        navigator.clipboard.writeText(getShareUrl());
      }}>
        <FontAwesomeIcon icon={faShareNodes}/>
      </button>
      {showShareLink && 
        <a href={getShareUrl()}>link</a>
      }
    </div>
  );
};

export default ShareUrlAlert;
