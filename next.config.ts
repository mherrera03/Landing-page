import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Solo afecta a `next dev`. Sin esto, el servidor de desarrollo rechaza las
   * peticiones que llegan desde otro dominio y el canal de recarga automática
   * (/_next/hmr) responde "Unauthorized" una y otra vez. Pasa al enseñar el
   * sitio por un túnel, que es como se comparte la vista previa.
   */
  allowedDevOrigins: ["*.trycloudflare.com", "**.devtunnels.ms", "*.ngrok-free.app", "*.ngrok.io"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Las imágenes que suba el panel en producción viven en Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }] },
      {
        // El panel nunca debe indexarse, incrustarse en otra página ni
        // filtrar sus URLs como referente al salir a otro sitio.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
