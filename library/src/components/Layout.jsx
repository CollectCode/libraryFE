// src/components/Layout.jsx
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 bg-gray-50 h-[850px]">{children}</main>
      </div>
    </div>
  );
}
