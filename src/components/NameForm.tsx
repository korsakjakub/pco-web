import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
  name: string;
  button: string;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const NameForm = ({
  name = "DefaultName",
  button = "Submit",
  isLoading = false,
  onSubmit,
}: Props) => {

  const [itemName, setItemName] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const regex = /^[a-zA-Z]*$/;
    if (regex.test(inputValue) && inputValue.length <= 50) {
      setItemName(inputValue);
    }
  };

  return (
    <form onSubmit={onSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        name={name + "Name"}
        placeholder={`${name} name`}
        aria-label={`${name} name`}
        aria-describedby={`new-${name}-input`}
        value={itemName}
        onChange={handleInputChange}
      />
      <button
        className="btn btn-outline-secondary"
        type="submit"
        id={`new-${name}-button`}
        disabled={isLoading || itemName.length < 2}
      >
        {isLoading && <Spinner />}
        {isLoading ? "Loading..." : button}
      </button>
    </form>
  );
};

export default NameForm;
