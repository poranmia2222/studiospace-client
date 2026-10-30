import Link from "next/link";
import Banner from "@/components/Banner";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero / banner */}
      <Banner />

      {/* How It Works (interactive, in HowItWorks component) */}
      <HowItWorks />

      {/* About Us (scroll target: /#about-us) */}
      <section id="about-us" className="scroll-mt-24 border-t border-edge">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">About Us</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            StudioSpace is built on a simple idea: the spaces where art happens
            shouldn&apos;t sit empty while creatives search for somewhere to
            work. We&apos;re a peer-to-peer platform that lets owners list their
            workspaces and lets creatives book them directly — fair rates, real
            conversations, full creative control.
          </p>
          <Link
            href="/studios"
            className="mt-8 inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-fuchsia-400"
          >
            Browse the studios
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
