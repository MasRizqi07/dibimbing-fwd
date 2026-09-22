import { ImageResponse } from "next/og";

export const alt = "Nexa Studio — studi konsep website agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#102a31", color: "#f7f8f4", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 42, fontWeight: 800 }}>
        <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "#c3f35b", color: "#102a31" }}>N</div>
        Nexa Studio
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, letterSpacing: -4, lineHeight: 1.05 }}><span>Ide digital yang</span><span>terlihat jelas.</span></div>
        <div style={{ fontSize: 28, color: "#c3f35b" }}>Studi konsep website agency</div>
      </div>
    </div>,
    size,
  );
}
