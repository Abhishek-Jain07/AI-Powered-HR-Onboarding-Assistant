import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">HR Assistant</h1>
                <nav>
                    <Link href="/" className="mr-4 hover:underline text-white font-medium">Chat</Link>
                    <Link href="/admin" className="hover:underline text-white font-medium">File Upload</Link>
                </nav>
            </div>
        </header>
    );
}
