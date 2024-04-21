import React, { useState } from "react";

interface Props {
  name: string;
  button: string;
  isLoading: boolean;
  className?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const NameForm = ({
  name = "DefaultName",
  button = "Submit",
  isLoading = false,
  className = "",
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
    <form onSubmit={onSubmit} className={className}>
      <input
        type="text"
        name={name + "Name"}
        placeholder={`${name} name`}
        aria-label={`${name} name`}
        aria-describedby={`new-${name}-input`}
        value={itemName}
        onChange={handleInputChange}
      />
      <button
        aria-busy={isLoading}
        type="submit"
        id={`new-${name}-button`}
        disabled={isLoading || itemName.length < 2}
      >
        {button}
      </button>
    </form>
  );
};

export default NameForm;
