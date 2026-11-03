import { Navbar } from "./components/Navbar";
import { BackgroundFX } from "./components/BackgroundFX";
import { Footer } from "./components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-gray-100 selection:bg-orange-500/30 bg-[#070308] overflow-x-hidden">
      

      <BackgroundFX />

      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

    </div>
  );
}