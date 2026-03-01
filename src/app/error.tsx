"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="font-mono text-6xl text-neon-cyan text-glow-cyan mb-4">
          ERR
        </div>
        <h1 className="font-mono text-xl text-text-primary mb-2">
          System Malfunction
        </h1>
        <p className="text-text-secondary text-sm mb-6">
          A critical error occurred while loading the feed.
        </p>
        <button
          onClick={reset}
          className="font-mono text-xs px-4 py-2 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/10 transition-colors"
        >
          &gt; RETRY_
        </button>
      </div>
    </div>
  );
}
