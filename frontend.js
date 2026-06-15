"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card } from "@/components/ui/card";

const socket = io("https://ghostlive-ai-mvp-production.up.railway.app");

export default function Dashboard() {
    const [status, setStatus] = useState("Disconnected");
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        socket.on('new_chat', (data) => setLogs(prev => [...prev, data]));
        socket.on('ai_response', (data) => {
            const audio = new Audio("data:audio/mp3;base64," + data.audio);
            audio.play();
        });
    }, []);

    return (
        <main className="p-8 bg-slate-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">GhostLive AI Dashboard</h1>
            <Card className="p-6">
                <button onClick={() => socket.emit('connect_tiktok', 'username_target')} className="bg-purple-600 px-4 py-2 rounded">Connect</button>
                <div className="mt-4 h-64 overflow-y-auto">
                    {logs.map((log, i) => <p key={i}><strong>{log.nickname}:</strong> {log.comment}</p>)}
                </div>
            </Card>
        </main>
    );
}
