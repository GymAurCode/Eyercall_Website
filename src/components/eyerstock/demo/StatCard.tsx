import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="p-2 bg-teal-100 rounded-lg text-teal-800">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}
