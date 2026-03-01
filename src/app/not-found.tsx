import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-8xl text-neon-purple text-glow-purple mb-4">
          404
        </div>
        <h1 className="font-mono text-xl text-text-primary mb-2">
          Signal Lost
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          The requested frequency could not be found.
        </p>
        <Link
          href="/"
          className="font-mono text-xs px-4 py-2 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/10 transition-colors"
        >
          &gt; RETURN_HOME_
        </Link>
      </div>
    </div>
  );
}
