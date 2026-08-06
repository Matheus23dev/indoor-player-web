import { useEffect, useState, type FormEvent } from "react";
import {
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  ImageIcon,
  Save,
  X,
} from "lucide-react";

import type { Media } from "../../Medias/types";
import type {
  OverlayBar,
  OverlayBarContentItem,
  OverlayBarContentPosition,
  OverlayBarPayload,
  OverlayBarPosition,
  OverlayBarWidgetType,
} from "../types";
import { OverlayBarPreview } from "./OverlayBarPreview";
import { OverlayBarContentEditor } from "./OverlayBarContentEditor";

interface OverlayBarFormModalProps {
  open: boolean;
  saving: boolean;
  images: Media[];
  initialBar?: OverlayBar | null;
  onClose: () => void;
  onSave: (payload: OverlayBarPayload) => Promise<unknown>;
}

const defaultPayload: OverlayBarPayload = {
  name: "",
  position: "BOTTOM",
  sizePercent: 12,
  backgroundColor: "#000000",
  opacity: 100,
  fit: "CONTAIN",
  contentPosition: "CENTER",
  contentAlignment: "CENTER",
  imageSizePercent: 80,
  contentPadding: 6,
  contentGap: 8,
  contentItems: [],
  textContent: null,
  textColor: "#FFFFFF",
  fontSize: 28,
  widgetType: "NONE",
  weatherLocation: null,
  mediaId: null,
};

const dynamicTokens = [
  "{{hora}}",
  "{{data}}",
  "{{dia_semana}}",
  "{{temperatura}}",
  "{{clima}}",
  "{{cidade}}",
];

const positionOptions: Array<{
  value: OverlayBarPosition;
  label: string;
  direction: "horizontal" | "vertical";
}> = [
  { value: "TOP", label: "Topo", direction: "horizontal" },
  { value: "BOTTOM", label: "Rodapé", direction: "horizontal" },
  { value: "LEFT", label: "Esquerda", direction: "vertical" },
  { value: "RIGHT", label: "Direita", direction: "vertical" },
];

export function OverlayBarFormModal({
  open,
  saving,
  images,
  initialBar,
  onClose,
  onSave,
}: OverlayBarFormModalProps) {
  const [form, setForm] = useState<OverlayBarPayload>(defaultPayload);

  useEffect(() => {
    if (!open) return;

    setForm(
      initialBar
        ? {
            name: initialBar.name,
            position: initialBar.position,
            sizePercent: initialBar.sizePercent,
            backgroundColor: initialBar.backgroundColor,
            opacity: initialBar.opacity,
            fit: initialBar.fit,
            contentPosition: initialBar.contentPosition ?? "CENTER",
            contentAlignment: initialBar.contentAlignment ?? "CENTER",
            imageSizePercent: initialBar.imageSizePercent ?? 80,
            contentPadding: initialBar.contentPadding ?? 6,
            contentGap: initialBar.contentGap ?? 8,
            contentItems: normalizeContentItemsForForm(
              (initialBar.contentItems?.length ?? 0) > 0
                ? (initialBar.contentItems ?? [])
                : createLegacyContentItems(initialBar),
              initialBar,
            ),
            textContent: initialBar.textContent ?? null,
            textColor: initialBar.textColor ?? "#FFFFFF",
            fontSize: initialBar.fontSize ?? 28,
            widgetType: initialBar.widgetType ?? "NONE",
            weatherLocation: initialBar.weatherLocation ?? null,
            mediaId: null,
          }
        : defaultPayload,
    );
  }, [initialBar, open]);

  const previewBar = {
    ...form,
    media: null,
  };
  const isHorizontalBar = form.position === "TOP" || form.position === "BOTTOM";
  const needsWeather = form.contentItems.some(
    (item) => item.type === "WEATHER" || /{{(?:temperatura|clima|cidade)}}/.test(item.text ?? ""),
  );
  const hasInvalidContent = form.contentItems.some(
    (item) =>
      (item.type === "TEXT" && !item.text?.trim()) ||
      (item.type === "IMAGE" && !item.mediaId) ||
      !/^#[0-9a-fA-F]{6}$/.test(item.textColor) ||
      Boolean(item.backgroundColor && !/^#[0-9a-fA-F]{6}$/.test(item.backgroundColor)),
  );

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const backgroundColor = form.backgroundColor.toUpperCase();
    const textColor = form.textColor.toUpperCase();
    const contentItems = form.contentItems.map((item) => ({
      ...item,
      text: item.text?.trim() || undefined,
      textColor: item.textColor.toUpperCase(),
      fontFamily: item.fontFamily ?? "SYSTEM",
      italic: item.italic ?? false,
      backgroundColor: item.backgroundColor?.toUpperCase() || undefined,
      mediaId: item.mediaId ?? null,
      imageSizePercent: item.imageSizePercent ?? 80,
      fit: item.fit ?? "CONTAIN",
      offsetX: item.offsetX ?? 0,
      offsetY: item.offsetY ?? 0,
    }));
    const firstText = contentItems.find((item) => item.type === "TEXT");
    const firstWidget = contentItems.find((item) =>
      ["CLOCK", "DATE", "WEATHER"].includes(item.type),
    );
    const usesWeather = needsWeather;

    if (
      !name ||
      !/^#[0-9A-F]{6}$/.test(backgroundColor) ||
      !/^#[0-9A-F]{6}$/.test(textColor) ||
      hasInvalidContent ||
      (usesWeather && !form.weatherLocation?.trim())
    )
      return;

    await onSave({
      ...form,
      name,
      backgroundColor,
      contentItems,
      textColor: firstText?.textColor ?? textColor,
      fontSize: firstText?.fontSize ?? form.fontSize,
      textContent: firstText?.text ?? null,
      widgetType: (firstWidget?.type as OverlayBarWidgetType | undefined) ?? "NONE",
      weatherLocation: form.weatherLocation?.trim() || null,
      mediaId: null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Elemento reutilizável
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-950">
              {initialBar ? "Editar barra" : "Nova barra fixa"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Uma alteração será aplicada a todas as playlists que usam esta barra.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={21} />
          </button>
        </header>

        <div
          data-testid="overlay-bar-modal-body"
          className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] overflow-hidden lg:grid-cols-[1.15fr_0.85fr] lg:grid-rows-1"
        >
          <div
            data-testid="overlay-bar-editor-scroll"
            className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6"
          >
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Nome da barra</span>
              <input
                autoFocus
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                maxLength={100}
                disabled={saving}
                placeholder="Ex.: Rodapé com logo da empresa"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-bold text-slate-700">Posição</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {positionOptions.map((option) => {
                  const active = form.position === option.value;
                  const Icon =
                    option.direction === "horizontal"
                      ? AlignHorizontalSpaceAround
                      : AlignVerticalSpaceAround;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      disabled={saving}
                      onClick={() => setForm((current) => ({ ...current, position: option.value }))}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                          : "border-slate-200 text-slate-600 hover:border-blue-200"
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Espessura
                  <strong className="text-blue-700">{form.sizePercent}%</strong>
                </span>
                <input
                  type="range"
                  min={2}
                  max={40}
                  value={form.sizePercent}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      sizePercent: Number(event.target.value),
                    }))
                  }
                  className="mt-3 w-full accent-blue-700"
                />
              </label>

              <label>
                <span className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Opacidade da cor
                  <strong className="text-blue-700">{form.opacity}%</strong>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.opacity}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, opacity: Number(event.target.value) }))
                  }
                  className="mt-3 w-full accent-blue-700"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-bold text-slate-700">
                  {isHorizontalBar ? "Alinhamento horizontal" : "Alinhamento vertical"}
                </span>
                <select
                  value={form.contentPosition}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contentPosition: event.target.value as OverlayBarContentPosition,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="START">{isHorizontalBar ? "Esquerda" : "Topo"}</option>
                  <option value="CENTER">Centro</option>
                  <option value="END">{isHorizontalBar ? "Direita" : "Base"}</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">
                  {isHorizontalBar ? "Alinhamento vertical" : "Alinhamento horizontal"}
                </span>
                <select
                  value={form.contentAlignment}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contentAlignment: event.target.value as OverlayBarContentPosition,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="START">{isHorizontalBar ? "Topo" : "Esquerda"}</option>
                  <option value="CENTER">Centro</option>
                  <option value="END">{isHorizontalBar ? "Base" : "Direita"}</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Recuo nas extremidades
                  <strong className="text-blue-700">{form.contentPadding}px</strong>
                </span>
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={form.contentPadding}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contentPadding: Number(event.target.value),
                    }))
                  }
                  className="mt-3 w-full accent-blue-700"
                />
                <span className="mt-1 block text-[11px] text-slate-500">
                  Nas barras horizontais afasta das laterais; nas barras laterais afasta do topo e
                  do rodapé.
                </span>
              </label>

              <label>
                <span className="flex items-center justify-between text-sm font-bold text-slate-700">
                  Espaçador entre conteúdos
                  <strong className="text-blue-700">{form.contentGap}px</strong>
                </span>
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={form.contentGap}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contentGap: Number(event.target.value),
                    }))
                  }
                  className="mt-3 w-full accent-blue-700"
                />
                <span className="mt-1 block text-[11px] text-slate-500">
                  Separa imagem, frase e conteúdo pronto.
                </span>
              </label>
            </div>

            <fieldset className="hidden">
              <legend className="px-2 text-sm font-bold text-slate-700">
                Frase e dados dinâmicos
              </legend>
              <textarea
                value={form.textContent ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    textContent: event.target.value || null,
                  }))
                }
                maxLength={500}
                rows={3}
                disabled={saving}
                placeholder="Ex.: Agora são {{hora}} e a temperatura é {{temperatura}}."
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm leading-5 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {dynamicTokens.map((token) => (
                  <button
                    key={token}
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        textContent: `${current.textContent ?? ""}${
                          current.textContent ? " " : ""
                        }${token}`,
                      }))
                    }
                    className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-blue-700 hover:bg-blue-100"
                  >
                    {token}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-700">Cor do texto</span>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="color"
                      value={form.textColor}
                      disabled={saving}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          textColor: event.target.value.toUpperCase(),
                        }))
                      }
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                    />
                    <input
                      value={form.textColor}
                      maxLength={7}
                      disabled={saving}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          textColor: event.target.value.toUpperCase(),
                        }))
                      }
                      className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 font-mono text-sm uppercase outline-none focus:border-blue-500"
                    />
                  </div>
                </label>

                <label>
                  <span className="flex items-center justify-between text-sm font-bold text-slate-700">
                    Tamanho do texto
                    <strong className="text-blue-700">{form.fontSize}px</strong>
                  </span>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    value={form.fontSize}
                    disabled={saving}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fontSize: Number(event.target.value),
                      }))
                    }
                    className="mt-3 w-full accent-blue-700"
                  />
                </label>
              </div>
            </fieldset>

            <div className="hidden">
              <label>
                <span className="text-sm font-bold text-slate-700">Conteúdo pronto</span>
                <select
                  value={form.widgetType}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      widgetType: event.target.value as OverlayBarWidgetType,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="NONE">Nenhum</option>
                  <option value="CLOCK">Relógio</option>
                  <option value="DATE">Data</option>
                  <option value="WEATHER">Clima da região</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-bold text-slate-700">Cidade ou região</span>
                <input
                  value={form.weatherLocation ?? ""}
                  disabled={saving || !needsWeather}
                  maxLength={120}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      weatherLocation: event.target.value || null,
                    }))
                  }
                  placeholder="Ex.: Rio de Janeiro, RJ"
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"
                />
                {needsWeather && !form.weatherLocation?.trim() && (
                  <span className="mt-1 block text-[11px] font-semibold text-amber-700">
                    Informe a região para atualizar o clima.
                  </span>
                )}
              </label>
            </div>

            <OverlayBarContentEditor
              items={form.contentItems}
              images={images}
              disabled={saving}
              weatherLocation={form.weatherLocation}
              onChange={(contentItems) => setForm((current) => ({ ...current, contentItems }))}
              onWeatherLocationChange={(weatherLocation) =>
                setForm((current) => ({ ...current, weatherLocation }))
              }
            />

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Cor de fundo</span>
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={form.backgroundColor}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      backgroundColor: event.target.value.toUpperCase(),
                    }))
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                />
                <input
                  value={form.backgroundColor}
                  maxLength={7}
                  disabled={saving}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      backgroundColor: event.target.value.toUpperCase(),
                    }))
                  }
                  className="h-10 flex-1 rounded-xl border border-slate-200 px-3 font-mono text-sm uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>
          </div>

          <aside
            data-testid="overlay-bar-preview-panel"
            className="min-h-0 overflow-hidden border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0 sm:p-6"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <ImageIcon size={17} className="text-blue-700" />
              Prévia na tela
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              A barra ficará fixa sobre o conteúdo durante toda a playlist.
            </p>
            <OverlayBarPreview
              bar={previewBar}
              images={images}
              className="mt-4 shadow-lg"
              showEmptyState
            />
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              Esta barra poderá ser vinculada a várias playlists sem precisar ser recriada.
            </div>
          </aside>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={
              saving ||
              !form.name.trim() ||
              !/^#[0-9a-fA-F]{6}$/.test(form.backgroundColor) ||
              !/^#[0-9a-fA-F]{6}$/.test(form.textColor) ||
              hasInvalidContent ||
              (needsWeather && !form.weatherLocation?.trim())
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar barra"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function createLegacyContentItems(bar: OverlayBar): OverlayBarContentItem[] {
  const items: OverlayBarContentItem[] = [];
  const baseStyle = {
    textColor: bar.textColor ?? "#FFFFFF",
    fontSize: bar.fontSize ?? 28,
    fontWeight: "BOLD" as const,
    fontFamily: "SYSTEM" as const,
    italic: false,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    spacerSize: 24,
    offsetX: 0,
    offsetY: 0,
  };

  if (bar.mediaId) {
    items.push({
      id: "legacy-image",
      type: "IMAGE",
      mediaId: bar.mediaId,
      imageSizePercent: bar.imageSizePercent ?? 80,
      fit: bar.fit ?? "CONTAIN",
      ...baseStyle,
    });
  }

  if (bar.textContent?.trim()) {
    items.push({
      id: "legacy-text",
      type: "TEXT",
      text: bar.textContent,
      ...baseStyle,
    });
  }

  if (bar.widgetType && bar.widgetType !== "NONE") {
    items.push({
      id: "legacy-widget",
      type: bar.widgetType,
      ...baseStyle,
    });
  }

  return items;
}

function normalizeContentItemsForForm(
  items: OverlayBarContentItem[],
  legacyBar?: OverlayBar,
): OverlayBarContentItem[] {
  const normalized: OverlayBarContentItem[] = items.map((item) => ({
    ...item,
    paddingHorizontal: item.paddingHorizontal ?? item.padding ?? 0,
    paddingVertical: item.paddingVertical ?? 0,
    imageSizePercent: item.imageSizePercent ?? 80,
    fit: item.fit ?? "CONTAIN",
    offsetX: item.offsetX ?? 0,
    offsetY: item.offsetY ?? 0,
  }));

  if (
    legacyBar?.mediaId &&
    !normalized.some((item) => item.type === "IMAGE" && item.mediaId === legacyBar.mediaId)
  ) {
    normalized.unshift(
      ...createLegacyContentItems({ ...legacyBar, textContent: null, widgetType: "NONE" }),
    );
  }

  return normalized;
}
