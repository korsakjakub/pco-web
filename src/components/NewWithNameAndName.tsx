import { useState } from "react";
import NameNameForm from "./NameNameForm";

interface Props {
  url: string;
  nameFirst: string;
  nameSecond: string;
  button: string;
  reqName: string;
  onSuccess: (responseBody: string) => void;
  onError: (responseBody: string) => void;
}

const NewWithNameAndName = ({
  url,
  nameFirst,
  nameSecond,
  button,
  reqName,
  onSuccess,
  onError,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestNew = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.get(reqName) }),
      };
      const response = await fetch(url, requestOptions);
      const responseBody = await response.json();

      if (response.ok) {
        onSuccess(JSON.stringify(responseBody));
      } else {
        onError(responseBody);
      }
    } catch (error) {
      onError && onError("Could not create a new " + button);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NameNameForm
      isLoading={isLoading}
      nameFirst={nameFirst}
      nameSecond={nameSecond}
      button={button}
      onSubmit={requestNew}
    />
  );
};

export default NewWithNameAndName;
