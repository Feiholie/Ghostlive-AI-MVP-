"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Koneksi ke backend, gunakan variable environment untuk production
const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");

export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("disconnected");
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        socket.on('status', (newStatus) => setStatus(newStatus));
        socket.on('new_chat', (data) => setLogs(prev => [...prev, data]));
        socket.on('ai_response', (data) => {
            const audio = new Audio("data:audio/mp3;base64," + data.audio);
            audio.play();
        });
        
        return () => {
            socket.off('status');
            socket.off('new_chat');
            socket.off('ai_response');
        };
    }, []);

    const connect = () => {
        if (username) socket.emit('connect_tiktok', username);
    };

    return (
        <main className="p-8 bg-slate-950 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">GhostLive AI Dashboard</h1>
            
            <Card className="p-6 bg-slate-900 border-slate-800">
                <div className="flex gap-2 mb-4">
                    <Input 
                        placeholder="Masukkan Username TikTok" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-slate-800"
                    />
                    <Button onClick={connect} disabled={status === 'connected'}>
                        {status === 'connected' ? 'Connected' : 'Connect'}
                    </Button>
                </div>
                
                <div className="text-sm mb-4">
                    Status: <span className={status === 'connected' ? 'text-green-500' : 'text-red-500'}>{status}</span>
                </div>

                <div className="mt-4 h-64 overflow-y-auto border border-slate-800 rounded p-4 bg-black">
                    {logs.map((log, i) => (
                        <p key={i} className="mb-1">
                            <strong className="text-blue-400">{log.nickname}:</strong> {log.comment}
                        </p>
                    ))}
                </div>
            </Card>
        </main>
    );
}