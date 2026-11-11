import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { list } from "@/server/database/repositories/publications.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationList } from "@/components/admin/publications/PublicationList";

export const metadata: Metadata = { title: "Noticias" };

export default function NewsAdminPage() {
  return <><PageHeader title="Noticias" description="Publica novedades para la comunidad." action={<Link href="/admin/noticias/nuevo" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white"><Plus className="size-4" />Nueva noticia</Link>} /><PublicationList kind="noticia" items={list("noticia")} /></>;
}
