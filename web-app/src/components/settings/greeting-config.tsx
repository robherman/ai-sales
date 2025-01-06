import React, { useState, useEffect } from "react";
import { getGreetings as fetchGreetingsApi } from "../../lib/apis/greetings";
import { saveGreeting } from "../../lib/app/actions";

interface Greeting {
  id: string;
  name: string;
  content: string;
  conditions: Record<string, any>;
  priority: number;
  isActive: boolean;
}

export const GreetingConfig: React.FC = () => {
  const [greetings, setGreetings] = useState<Greeting[]>([]);

  useEffect(() => {
    fetchGreetings();
  }, []);

  const fetchGreetings = async () => {
    const response = await fetchGreetingsApi();
    setGreetings(response);
  };

  const handleGreetingUpdate = async (id: string, data: Partial<Greeting>) => {
    await saveGreeting(id, data);
    fetchGreetings();
  };

  const handleGreetingCreate = async (data: Omit<Greeting, "id">) => {
    // await api.post("/v1/greetings", data);
    fetchGreetings();
  };

  return (
    <div>
      <h2>Greeting Configuration</h2>
      {greetings.map((greeting) => (
        <div key={greeting.id}>
          <h3>{greeting.name}</h3>
          <textarea
            value={greeting.content}
            onChange={(e) =>
              handleGreetingUpdate(greeting.id, { content: e.target.value })
            }
          />
          <input
            type="number"
            value={greeting.priority}
            onChange={(e) =>
              handleGreetingUpdate(greeting.id, {
                priority: parseInt(e.target.value),
              })
            }
          />
          <input
            type="checkbox"
            checked={greeting.isActive}
            onChange={(e) =>
              handleGreetingUpdate(greeting.id, { isActive: e.target.checked })
            }
          />
          {/* Add more fields for conditions */}
        </div>
      ))}
      {/* Add form for creating new greetings */}
    </div>
  );
};
