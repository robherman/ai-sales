import { useState, useEffect } from "react";

export function useEventSource(url: string) {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data).content;
      setData((prevData) => prevData + newData);
    };

    eventSource.onerror = (error) => {
      setError("EventSource failed");
      setIsLoading(false);
      eventSource.close();
    };

    eventSource.onopen = () => {
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, error, isLoading };
}
