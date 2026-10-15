import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollTo } from "./Navbar";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Shop Smart. Live Better.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">
          Handpicked electronics, fashion and home essentials — delivered with care at prices you'll love.
        </p>
        <Button size="lg" variant="secondary" className="mt-8 rounded-full px-8 shadow-lg transition-transform hover:scale-105" onClick={() => scrollTo("products")}>
          Shop Now <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
