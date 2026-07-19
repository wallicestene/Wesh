import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-(--navbar-h) items-center justify-between">
        <Link href="/">
          <span className="font-display text-xl font-semibold tracking-normal text-wesh-ink md:text-2xl">
            Wesh
          </span>
        </Link>

        <ul className="hidden items-center rounded-full border border-border/80 bg-card/70 p-1 shadow-sm md:flex">
          <li>
            <Link
              href="/about"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-wesh-mint/35 hover:text-wesh-pine"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-wesh-mint/35 hover:text-wesh-pine"
            >
              Pricing
            </Link>
          </li>
        </ul>

        <a
          href="#chat"
          className="rounded-full bg-wesh-pine px-4 py-2 text-sm font-medium text-white shadow-sm shadow-wesh-pine/15 transition hover:-translate-y-0.5 hover:bg-wesh-teal"
        >
          Start search
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
