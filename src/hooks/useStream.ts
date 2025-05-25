import { useEffect, useState } from 'react';

const useStream = <T = unknown>(
    endpointUrl: string, 
    onSuccess?: (stream: T) => void
): T | null => {
    const [stream, setStream] = useState<T | null>(null);

    useEffect(() => {
        const eventSource = new EventSource(endpointUrl);

        eventSource.addEventListener('message', (event: MessageEvent) => {
            try {
                const updatedGame: T = JSON.parse(event.data);
                if (updatedGame !== null) {
                    setStream(updatedGame);
                    onSuccess?.(updatedGame);
                }
            } catch (error) {
                console.error('Failed to parse SSE data:', error);
            }
        });

        eventSource.addEventListener('error', (error) => {
            console.error('SSE connection error:', error);
        });

        return () => {
            eventSource.close();
        };
    }, [endpointUrl]);

    return stream;
};

export default useStream;
