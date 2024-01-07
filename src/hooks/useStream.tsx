import { useEffect, useState } from 'react';

const useStream = (endpointUrl: string, onSuccess?: (stream: any) => void) => {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource(endpointUrl);

        eventSource.addEventListener('message', (event) => {
            const updatedGame = JSON.parse(event.data);
            if (updatedGame !== null) {
                setStream(updatedGame);
                onSuccess?.(updatedGame);
            }
        });

        return () => {
            eventSource.close();
        };
    }, []);

    return stream;
};

export default useStream;
