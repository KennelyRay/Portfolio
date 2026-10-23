import DotField from "./DotField";

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Drifting light orbs. Soft edges come from a radial gradient rather
          than filter: blur(), which had to be re-rasterised on every frame the
          orb moved. The drift is a CSS animation on transform, so it runs on
          the compositor and never touches the main thread. */}
      <div className="bg-orb bg-orb-a" />
      <div className="bg-orb bg-orb-b" />

      {/* Cursor-reactive dot field, pinned to the viewport so it stays
          visible across every section while scrolling */}
      <div className="absolute inset-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={18}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(0, 168, 255, 0.35)"
          gradientTo="rgba(0, 168, 255, 0.12)"
          glowColor="#0e3a52"
        />
      </div>
    </div>
  );
}
