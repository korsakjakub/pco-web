import { useState } from "react";
import { Toast } from "react-bootstrap";
interface Props {
  url: string;
  queueId: string;
}

const ShareUrlAlert = ({ url, queueId }: Props) => {
  const [showAlert, setShowAlert] = useState(false);
  const onShareClick = () => {
    setShowAlert(true);
    navigator.clipboard.writeText(getShareUrl());
  };
  const getShareUrl = () => {
    return url + "/join/" + queueId;
  };
  return (
    <>
      <button type="button" className="btn btn-primary" onClick={onShareClick}>
        Share
      </button>
      <Toast
        onClose={() => setShowAlert(false)}
        autohide
        show={showAlert}
        delay={2200}
      >
        <Toast.Header>
          <strong className="mr-auto">Copied to clipboard</strong>
        </Toast.Header>
        <Toast.Body>{getShareUrl()}</Toast.Body>
      </Toast>
    </>
  );
};

export default ShareUrlAlert;
