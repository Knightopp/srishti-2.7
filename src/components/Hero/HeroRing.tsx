import LogoBuild from "./LogoBuild/LogoBuild";

export default function HeroRing() {
  return (
    <div className="ring-system">
      {/* Main horizontal energy ring */}
      <div className="ring" />

      {/* Central 3D Scroll-Driven Isometric Block-by-Block Logo Build */}
      <div className="ring-logo-stage">
        <LogoBuild />
      </div>

      {/* 3D orbital paths */}
      <div className="orbit orbit-1" />
      <div className="orbit orbit-2" />
      <div className="orbit orbit-3" />

      {/* Floor glow light */}
      <div className="ring-light" />
    </div>
  );
}