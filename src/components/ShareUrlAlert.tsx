import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import QRCode from 'qrcode.react';

interface Props {
  url: string;
  queueId: string;
}

const ShareUrlAlert = ({ url, queueId }: Props) => {
  const [showQR, setShowQR] = useState(false);
  const link = url + "/join/" + queueId;

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Żetony',
          url: link
        });
      } else {
        setShowQR(!showQR);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="share-url-alert">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          shareLink();
        }}
      >
        <FontAwesomeIcon icon={faShareNodes} />
      </button>
      {showQR && (
        <dialog open id="qr-code">
          <article className="qr-dialog">
            <p>Scan this QR code to join the room</p>
            <div className="qr-code-container">
              <QRCode value={link} />
            </div>
            <footer>
              <a
                href="#cancel"
                role="button"
                className="secondary"
                data-target="qr-code"
                onClick={() => setShowQR(false)}>
                Close
              </a>
            </footer>
          </article>
        </dialog>
      )}
    </div>
  );
};

export default ShareUrlAlert;
