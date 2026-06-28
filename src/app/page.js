import HomeClient from "@/components/HomeClient";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

async function getServiceStatus() {
  try {
    const res = await fetch(`${SERVER}/api/status`, { cache: "no-store" });
    return await res.json();
  } catch {
    return {
      isOpen: true,
      message: "",
      phase: "morning",
      etaText: "today evening",
      nextTransitionAt: null,
    };
  }
}

export default async function Home() {
  const status = await getServiceStatus();
  return <HomeClient status={status} />
}