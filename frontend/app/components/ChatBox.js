'use client';
import { useState } from 'react';

export default function ChatBox() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you with HR policies today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input }),
            });
            const data = await res.json();

            const botMsg = {
                role: 'assistant',
                content: data.answer,
                sources: data.sources
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Is the backend running?' }]);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto border rounded-lg shadow-sm h-[600px] flex flex-col bg-white">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 text-sm opacity-90 border-t border-gray-400 pt-1 font-semibold">
                                    <strong>Sources:</strong> {msg.sources.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-gray-700 text-sm italic ml-4">Thinking...</div>}
            </div>
            <div className="p-4 border-t flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder-gray-600"
                    placeholder="Ask about leave, benefits..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-medium"
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
