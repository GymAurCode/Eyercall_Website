import { Outlet, Link } from "@tanstack/react-router";

export default function DemoLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="w-64 border-r bg-white p-4">
        <h2 className="mb-6 font-bold text-sky-800">EyerFlow Demo</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/software/eyerflow/demo" className="p-2 hover:bg-slate-100 rounded">Dashboard</Link>
          <Link to="/software/eyerflow/demo/ims" className="p-2 hover:bg-slate-100 rounded">Inventory (IMS)</Link>
          <Link to="/software/eyerflow/demo/mms" className="p-2 hover:bg-slate-100 rounded">Manufacturing (MMS)</Link>
          <Link to="/software/eyerflow/demo/wms" className="p-2 hover:bg-slate-100 rounded">Warehouse (WMS)</Link>
          <Link to="/software/eyerflow/demo/oms" className="p-2 hover:bg-slate-100 rounded">Orders (OMS)</Link>
        </nav>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between border-b bg-white p-4">
          <h1 className="text-lg font-semibold text-slate-800">
            EyerFlow — Interactive Read-Only Demo
          </h1>
          <div className="flex gap-2">
            <a href="/" className="text-sm text-slate-600 hover:text-sky-700">Back to Eyercall</a>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
