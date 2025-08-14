import Header from "../../components/layouts/Header";
import Sidebar from "../../components/layouts/Sidebar";
import {SocketProvider} from "../../contexts/SocketContext.js"

export default function DashboardLayout({ children }) {
  return (
    <div>
        <SocketProvider>
        <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
        </SocketProvider>
    </div>
  );
}
