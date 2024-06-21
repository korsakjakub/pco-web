type Props = {
  open: boolean;
  id: string;
  message: string;
  isLoading?: boolean;
  onCancelled: () => void;
  onConfirmed: () => void;
}

const ConfirmationModal = ({ open, id, message, isLoading=false, onCancelled, onConfirmed } : Props) => <>{open &&
    <dialog open id={id}>
      <article>
        <a href="#close"
          aria-label="Close"
          className="close"
          data-target={id}
          onMouseDown={() => onCancelled()}>
        </a>
        <p>
          {message}
        </p>
        <footer>
          <a href="#cancel"
            role="button"
            className="secondary"
            data-target={id}
            onMouseDown={() => onCancelled()}>
            No
          </a>
          <a href="#confirm"
            role="button"
            aria-busy={isLoading}
            data-target={id}
            onMouseDown={() => {
              onConfirmed()
            }}>
            Yeah
          </a>
        </footer>
      </article>
    </dialog>
  }
  </>

export default ConfirmationModal
