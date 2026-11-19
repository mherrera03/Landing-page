"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, Trash2 } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { MAX_IMAGE_MB, imageFormatsLabel, imageMimeTypes, imageProblem } from "@/lib/image-rules";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  label: string;
  /** Ruta de la imagen ya guardada (al editar). */
  defaultValue?: string;
  error?: string;
  required?: boolean;
  /** Recomendación sobre la forma o el tamaño de la imagen. */
  hint?: string;
  /** Nombre del campo con el archivo. */
  fileField?: string;
  /** Nombre del campo oculto con la ruta de la imagen ya guardada. */
  pathField?: string;
  /** Acepta también SVG. Solo para el logo: el servidor debe permitirlo igual. */
  allowSvg?: boolean;
};

/**
 * Sube una imagen o arrástrala. El archivo viaja en `fileField`; `pathField`
 * lleva la ruta actual por si no se cambia la imagen.
 *
 * Cuando el servidor guarda una imagen nueva, `defaultValue` cambia y el campo
 * se reinicia con ella: el archivo elegido ya no hace falta.
 */
export function ImageUpload(props: ImageUploadProps) {
  return <ImageUploadField key={props.defaultValue ?? ""} {...props} />;
}

function ImageUploadField({
  label,
  defaultValue = "",
  error,
  required = true,
  hint = "Se recomienda horizontal (16:11).",
  fileField = "imagenArchivo",
  pathField = "image",
  allowSvg = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  /** Vista previa del archivo elegido. Mientras no haya uno, se muestra la imagen guardada. */
  const [chosen, setChosen] = useState<{ name: string; url: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Las URL de vista previa ocupan memoria hasta que se liberan
  useEffect(() => {
    if (!chosen) return;
    return () => URL.revokeObjectURL(chosen.url);
  }, [chosen]);

  function clear() {
    setChosen(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function take(file: File | undefined) {
    if (!file) return;

    const problem = imageProblem(file, { allowSvg });
    setLocalError(problem);
    if (problem) {
      // Un archivo que no sirve no debe viajar con el formulario
      clear();
      return;
    }

    setChosen({ name: file.name, url: URL.createObjectURL(file) });
  }

  const preview = chosen?.url ?? defaultValue;

  return (
    <Field id={fileField} label={label} required={required} optional={!required} error={localError ?? error} className="sm:col-span-2">
      {/* Conserva la imagen guardada si no se sube una nueva */}
      <input type="hidden" name={pathField} value={defaultValue} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          // El archivo soltado debe quedar en el input para viajar en FormData.
          if (inputRef.current) inputRef.current.files = e.dataTransfer.files;
          take(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col gap-4 rounded-xl border-2 border-dashed p-4 transition-colors duration-200 sm:flex-row sm:items-center",
          dragging ? "border-violet-deep bg-violet-soft" : "border-line bg-paper",
        )}
      >
        <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-40">
          {preview ? (
            <Image src={preview} alt="" fill sizes="160px" className="object-cover" unoptimized={chosen !== null} />
          ) : (
            <span className="grid h-full place-items-center text-xs text-muted">Sin imagen</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={fileField}
            name={fileField}
            type="file"
            accept={imageMimeTypes({ allowSvg }).join(",")}
            className="sr-only"
            onChange={(e) => take(e.target.files?.[0])}
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

            {chosen && (
              <button
                type="button"
                onClick={() => {
                  setLocalError(null);
                  clear();
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-muted transition-colors duration-200 hover:text-danger"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Quitar
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-muted">
            {chosen?.name ?? "Arrastra una imagen aquí o elige una desde tu computadora."}
            <br />
            {imageFormatsLabel({ allowSvg })} · máximo {MAX_IMAGE_MB} MB · {hint}
          </p>
        </div>
      </div>
    </Field>
  );
}
