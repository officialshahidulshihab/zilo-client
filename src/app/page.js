import OrderForm from "@/components/OrderForm";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import Declaration from "@/components/Declaration";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getServiceStatus() {
  try {
    const res = await fetch(`${SERVER}/api/status`, { cache: "no-store" });
    return await res.json();
  } catch {
    return { isOpen: true, message: "" };
  }
}

export default async function Home() {
  const status = await getServiceStatus();

  return (
    <main className="bg-[var(--color-paper)] min-h-screen">
      <div className="max-w-xl mx-auto px-4 pb-16">
        <Header isOpen={status.isOpen} statusMessage={status.message} />
        <HowItWorks />
        <Declaration />
        <OrderForm isOpen={status.isOpen} />
      </div>
    </main>
  );
}