'use client';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/documents');
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.documents);
            }
        } catch (err) {
            console.error("Failed to fetch documents", err);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://127.0.0.1:8000/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setFile(null);
                // Reset file input
                document.getElementById('fileInput').value = '';
                await fetchDocuments();
                alert('File uploaded successfully!');
            } else {
                const errorText = await res.text();
                console.error("Upload failed:", errorText);
                alert(`Upload failed: ${errorText}`);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert('Upload failed. See console for details.');
        }
        setUploading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Manage Knowledge Base</h2>

            <div className="mb-6 p-4 border border-dashed border-gray-400 rounded bg-gray-50">
                <h3 className="font-semibold mb-2 text-gray-900">Upload New Policy Document</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border border-gray-400 p-2 rounded flex-1 text-gray-900 bg-white"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50 font-medium"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">Supported formats: PDF, DOCX, TXT</p>
            </div>

            <div>
                <h3 className="font-semibold mb-2 text-gray-900">Current Documents ({documents.length})</h3>
                <ul className="divide-y divide-gray-300 border border-gray-300 rounded max-h-60 overflow-y-auto bg-gray-50">
                    {documents.map((doc, i) => (
                        <li key={i} className="p-3 text-gray-900 text-sm flex justify-between items-center hover:bg-gray-100">
                            <span className="font-medium">{doc}</span>
                        </li>
                    ))}
                    {documents.length === 0 && <li className="p-3 text-gray-600 text-center font-medium">No documents found.</li>}
                </ul>
            </div>
        </div>
    );
}
