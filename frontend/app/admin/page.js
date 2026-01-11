import Header from '../components/Header';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                    <AdminPanel />
                </div>
            </main>
        </div>
    );
}
