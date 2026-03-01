export default function NeonDivider() {
  return (
    <div className="relative my-12 mx-auto max-w-7xl px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-cyan glow-cyan" />
    </div>
  );
}
