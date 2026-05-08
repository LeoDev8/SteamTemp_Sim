import { useState, useEffect } from 'react';

export function useSimulation() {
    const [dataHistory, setDataHistory] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/simulation/ws");

        socket.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            const incoming = JSON.parse(event.data);
            setDataHistory(prev => {
                // Vocabulary: "Maintaining" - keeping something in a consistent state.
                // We maintain a 50-point window for a smooth scrolling effect.
                const newHistory = [...prev, incoming];
                console.log(newHistory)
                return newHistory.slice(-50);
            });
        };

        socket.onclose = () => setIsConnected(false);

        return () => socket.close();
    }, []);

    return { dataHistory, isConnected };
}