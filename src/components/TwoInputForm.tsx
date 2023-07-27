import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";

interface InputProps {
  hint: string;
  value: string;
  isId: boolean;
}

interface Props {
  first: InputProps;
  second: InputProps;
  button: string;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const TwoInputForm = ({
  first,
  second,
  button,
  isLoading,
  onSubmit,
}: Props) => {
  const [firstValue, setFirstValue] = useState("");
  const [secondValue, setSecondValue] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<any>,
    isId: boolean,
    setFunction: (s: string) => void
  ) => {
    const inputValue = event.target.value;
    const isValidInput =
      isId && inputValue.length <= 50 ? true : /^[a-zA-Z]*$/.test(inputValue);

    if (isValidInput) {
      setFunction(inputValue);
    } 
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Control
          type="text"
          name={first.value}
          value={firstValue}
          placeholder={first.hint}
          aria-label={first.hint}
          aria-describedby={"new-" + first.value + "-input"}
          onChange={(event) =>
            handleInputChange(event, first.isId, setFirstValue)
          }
        />
        <Form.Control
          type="text"
          name={second.value}
          value={secondValue}
          placeholder={second.hint}
          aria-label={second.hint}
          aria-describedby={"new-" + second.value + "-input"}
          onChange={(event) =>
            handleInputChange(event, second.isId, setSecondValue)
          }
        />
        <Button
          variant="outline-secondary"
          type="submit"
          id={"new-" + first.value + "-button"}
          disabled={isLoading || (firstValue.length < 2 || secondValue.length < 2)}
        >
          {isLoading && <Spinner />}
          {isLoading ? "Loading..." : button}
        </Button>
      </Form.Group>
    </Form>
  );
};

export default TwoInputForm;
