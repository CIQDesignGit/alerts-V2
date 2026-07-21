export function CommerceIqLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="font-semibold tracking-tight text-shell-foreground">
        <span className="text-shell-accent">IQ</span>
      </span>
    );
  }

  return (
    <span className="text-lg font-semibold tracking-tight text-shell-foreground">
      Commerce
      <span className="text-shell-accent">IQ</span>
    </span>
  );
}
