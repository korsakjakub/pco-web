import { faQrcode, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import QRCode from "qrcode.react";

interface Props {
  url: string;
  queueId: string;
}

const ShareUrlAlert = ({ url, queueId }: Props) => {
  const [showQR, setShowQR] = useState(false);
  const link = window.location.host + "/join/" + queueId;

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "jetons",
          url: link,
        });
      } else {
        navigator.clipboard.writeText(link);
        alert("Link is copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <button type="button" onMouseDown={() => shareLink()}>
              <FontAwesomeIcon icon={faShareNodes} />
            </button>
          </li>
          <li>
            <button type="button" onMouseDown={() => setShowQR(!showQR)}>
              <FontAwesomeIcon icon={faQrcode} />
            </button>
          </li>
        </ul>
      </nav>

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
                onMouseDown={() => setShowQR(false)}
              >
                Close
              </a>
            </footer>
          </article>
        </dialog>
      )}
    </>
  );
};

export default ShareUrlAlert;
