export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="plan-layout">
      <main className="plan-main">{children}</main>
    </div>
  );
}
