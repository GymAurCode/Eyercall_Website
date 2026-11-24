import { Outlet, Link } from "@tanstack/react-router";

export default function DemoLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="w-64 border-r bg-white p-4">
        <h2 className="mb-6 font-bold text-teal-800">EyerStock Demo</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/software/eyerstock/demo" className="p-2 hover:bg-slate-100 rounded">Dashboard</Link>
          <Link to="/software/eyerstock/demo/products" className="p-2 hover:bg-slate-100 rounded">Products</Link>
          <Link to="/software/eyerstock/demo/sales" className="p-2 hover:bg-slate-100 rounded">Sales</Link>
          <Link to="/software/eyerstock/demo/purchases" className="p-2 hover:bg-slate-100 rounded">Purchases</Link>
          <Link to="/software/eyerstock/demo/parties" search={{ kind: "customer" }} className="p-2 hover:bg-slate-100 rounded">Customers</Link>
          <Link to="/software/eyerstock/demo/parties" search={{ kind: "supplier" }} className="p-2 hover:bg-slate-100 rounded">Suppliers</Link>
          <Link to="/software/eyerstock/demo/finance" className="p-2 hover:bg-slate-100 rounded">Finance</Link>
          <Link to="/software/eyerstock/demo/reports" className="p-2 hover:bg-slate-100 rounded">Reports</Link>
          <Link to="/software/eyerstock/demo/settings" className="p-2 hover:bg-slate-100 rounded">Settings</Link>
        </nav>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between border-b bg-white p-4">
          <h1 className="text-lg font-semibold text-slate-800">
            EyerStock — Interactive Read-Only Demo
          </h1>
          <div className="flex gap-2">
            <a href="/" className="text-sm text-slate-600 hover:text-teal-700">Back to Eyercall</a>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
