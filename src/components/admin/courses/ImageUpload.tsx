"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const MAX_MB = 4;
const ACEPTADOS = "image/webp,image/jpeg,image/png,image/avif";

type ImageUploadProps = {
  /** Ruta de la imagen ya guardada (al editar un curso). */
  defaultValue?: string;
  error?: string;
};

/**
 * Sube una imagen o arrástrala. El archivo viaja en `imagenArchivo`;
 * `image` lleva la ruta actual por si no se cambia la imagen.
 */
export function ImageUpload({ defaultValue = "", error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultValue);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function tomarArchivo(file: File | undefined) {
    if (!file) return;
    setLocalError(null);

    if (!ACEPTADOS.split(",").includes(file.type)) {
      setLocalError("Formato no permitido. Usa WebP, JPG, PNG o AVIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setLocalError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo son ${MAX_MB} MB.`);
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function quitar() {
    setPreview(defaultValue);
    setFileName(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <Field id="imagenArchivo" label="Imagen del curso" required error={localError ?? error} className="sm:col-span-2">
      {/* Conserva la imagen guardada si no se sube una nueva */}
      <input type="hidden" name="image" value={defaultValue} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          tomarArchivo(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col gap-4 rounded-xl border-2 border-dashed p-4 transition-colors duration-200 sm:flex-row sm:items-center",
          dragging ? "border-violet-deep bg-violet-soft" : "border-line bg-paper",
        )}
      >
        <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-40">
          {preview ? (
            <Image src={preview} alt="" fill sizes="160px" className="object-cover" unoptimized={preview.startsWith("blob:")} />
          ) : (
            <span className="grid h-full place-items-center text-xs text-muted">Sin imagen</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id="imagenArchivo"
            name="imagenArchivo"
            type="file"
            accept={ACEPTADOS}
            className="sr-only"
            onChange={(e) => tomarArchivo(e.target.files?.[0])}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
            >
              <ImageUp className="size-4" aria-hidden="true" />
              {preview ? "Cambiar imagen" : "Elegir imagen"}
            </button>

            {fileName && (
              <button
                type="button"
                onClick={quitar}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-muted transition-colors duration-200 hover:text-danger"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Quitar
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-muted">
            {fileName ?? "Arrastra una imagen aquí o elige una desde tu computadora."}
            <br />
            WebP, JPG, PNG o AVIF · máximo {MAX_MB} MB · se recomienda horizontal (16:11).
          </p>
        </div>
      </div>
    </Field>
  );
}
