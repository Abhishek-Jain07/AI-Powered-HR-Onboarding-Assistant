import Header from './components/Header';
import ChatBox from './components/ChatBox';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Welcome to HR Support</h2>
          <p className="text-center text-gray-600 mb-8">Ask any questions about our policies, benefits, or culture.</p>
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
