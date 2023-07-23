import { useState } from "react";
import NameForm from "./NameForm";

interface Props {
    url: string;
    objName: string;
    reqName: string;
    onSuccess: (responseBody: string) => void;
    onError: (responseBody: string) => void;
}

const NewWithName = ({ url, objName, reqName, onSuccess, onError }: Props) => {

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
      onError && onError("Could not create a new " + objName);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NameForm isLoading={isLoading} name={objName} onSubmit={requestNew} />
  );
};

export default NewWithName;