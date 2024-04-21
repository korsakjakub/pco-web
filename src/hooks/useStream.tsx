import { useEffect, useState } from 'react';

const useStream = (endpointUrl: string, onSuccess?: (stream: any) => void) => {
    const [stream, setStream] = useState<unknown>(null);
    const [error, setError] = useState(String);

    useEffect(() => {
        const eventSource = new EventSource(endpointUrl);

        eventSource.addEventListener('message', (event) => {
            const streamData = JSON.parse(event.data);
            if (streamData !== null) {
                setStream(streamData);
                onSuccess?.(streamData);
            }
        });

        /*
        eventSource.onerror = (event) => {
          setError('Error occurred while fetching data');
          console.error('Error occurred while fetching data:', event);
        };
        */

        return () => {
            eventSource.close();
        };
  }, [endpointUrl, onSuccess]);

    return { stream, error };
};

export default useStream;
