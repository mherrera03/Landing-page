import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SITE } from "@/constants/site";
import { getBrandSettings } from "@/server/database/repositories/settings.repository";
import { connection } from "next/server";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const brand = await getBrandSettings();
  const shareUrl = brand.siteUrl && brand.shareImage ? new URL(brand.shareImage, brand.siteUrl).toString() : undefined;
  return {
    title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
    description: brand.siteDescription,
    applicationName: SITE.name,
    ...(brand.siteUrl ? { metadataBase: new URL(brand.siteUrl) } : {}),
    openGraph: {
      title: `${SITE.name} — ${SITE.tagline}`,
      description: brand.siteDescription,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      ...(shareUrl ? { images: [{ url: shareUrl, alt: brand.shareImageAlt }] } : {}),
    },
    ...(shareUrl ? { twitter: { card: "summary_large_image", images: [shareUrl] } } : {}),
    // Sitio en pruebas: mantenerlo fuera de los índices hasta la publicación.
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  // Sin zoom bloqueado a propósito: los inputs ya miden 16px, que era lo que lo provocaba.
  // cover: la página llega hasta el notch y los bordes; el contenido se separa con env(safe-area-inset-*).
  viewportFit: "cover",
  // Con el teclado abierto el viewport se encoge: el formulario y los bottom sheets lo respetan.
  interactiveWidget: "resizes-content",
  // El sitio solo tiene tema claro, así que una sola barra de estado: la franja del anuncio y el pie son ink.
  themeColor: "#000120",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
