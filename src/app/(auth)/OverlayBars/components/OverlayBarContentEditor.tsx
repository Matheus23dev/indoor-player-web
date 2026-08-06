import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type {
  OverlayBarContentItem,
  OverlayBarContentType,
  OverlayBarFontFamily,
  OverlayBarFontWeight,
} from "../types";

interface OverlayBarContentEditorProps {
  items: OverlayBarContentItem[];
  disabled: boolean;
  weatherLocation: string | null;
  onChange: (items: OverlayBarContentItem[]) => void;
  onWeatherLocationChange: (value: string | null) => void;
}

const dynamicTokens = [
  "{{hora}}",
  "{{data}}",
  "{{dia_semana}}",
  "{{temperatura}}",
  "{{clima}}",
  "{{cidade}}",
];

const contentTypes: Array<{ value: OverlayBarContentType; label: string }> = [
  { value: "TEXT", label: "Frase / texto dinâmico" },
  { value: "CLOCK", label: "Relógio" },
  { value: "DATE", label: "Data" },
  { value: "WEATHER", label: "Clima" },
  { value: "SPACER", label: "Espaçador" },
];

export function OverlayBarContentEditor({
  items,
  disabled,
  weatherLocation,
  onChange,
  onWeatherLocationChange,
}: OverlayBarContentEditorProps) {
  const needsWeather = items.some(
    (item) => item.type === "WEATHER" || /{{(?:temperatura|clima|cidade)}}/.test(item.text ?? ""),
  );

  function updateItem(id: string, patch: Partial<OverlayBarContentItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <fieldset className="rounded-2xl border border-slate-200 p-4">
      <legend className="px-2 text-sm font-bold text-slate-700">Conteúdos independentes</legend>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700">
                {index + 1}
              </span>
              <select
                value={item.type}
                disabled={disabled}
                onChange={(event) =>
                  updateItem(item.id, { type: event.target.value as OverlayBarContentType })
                }
                className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold outline-none focus:border-blue-500"
              >
                {contentTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => moveItem(index, -1)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                aria-label="Mover conteúdo para cima"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={disabled || index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-30"
                aria-label="Mover conteúdo para baixo"
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(items.filter((current) => current.id !== item.id))}
                className="rounded-lg border border-red-100 bg-white p-2 text-red-600 disabled:opacity-30"
                aria-label="Remover conteúdo"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {item.type === "TEXT" && (
              <div className="mt-3">
                <textarea
                  value={item.text ?? ""}
                  onChange={(event) => updateItem(item.id, { text: event.target.value })}
                  maxLength={500}
                  rows={2}
                  disabled={disabled}
                  placeholder="Digite uma frase ou use dados dinâmicos..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {dynamicTokens.map((token) => (
                    <button
                      key={token}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        updateItem(item.id, {
                          text: `${item.text ?? ""}${item.text ? " " : ""}${token}`,
                        })
                      }
                      className="rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-700"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.type === "SPACER" ? (
              <RangeField
                label="Tamanho do espaçador"
                value={item.spacerSize}
                max={200}
                disabled={disabled}
                onChange={(spacerSize) => updateItem(item.id, { spacerSize })}
              />
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <ColorField
                  label="Cor"
                  value={item.textColor}
                  disabled={disabled}
                  onChange={(textColor) => updateItem(item.id, { textColor })}
                />
                <RangeField
                  label="Tamanho"
                  value={item.fontSize}
                  min={10}
                  max={120}
                  disabled={disabled}
                  onChange={(fontSize) => updateItem(item.id, { fontSize })}
                />
                <label>
                  <span className="text-xs font-bold text-slate-600">Peso</span>
                  <select
                    value={item.fontWeight}
                    disabled={disabled}
                    onChange={(event) =>
                      updateItem(item.id, {
                        fontWeight: event.target.value as OverlayBarFontWeight,
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="SEMIBOLD">Seminegrito</option>
                    <option value="BOLD">Negrito</option>
                  </select>
                </label>
                <label>
                  <span className="text-xs font-bold text-slate-600">Fonte</span>
                  <select
                    value={item.fontFamily ?? "SYSTEM"}
                    disabled={disabled}
                    onChange={(event) =>
                      updateItem(item.id, {
                        fontFamily: event.target.value as OverlayBarFontFamily,
                      })
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none"
                  >
                    <option value="SYSTEM">Padrão do aparelho</option>
                    <option value="SANS_SERIF">Sem serifa</option>
                    <option value="SANS_SERIF_CONDENSED">Sem serifa condensada</option>
                    <option value="SERIF">Com serifa</option>
                    <option value="MONOSPACE">Monoespaçada</option>
                  </select>
                </label>
                <label className="flex min-h-9 items-center gap-2 self-end rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <input
                    type="checkbox"
                    checked={item.italic ?? false}
                    disabled={disabled}
                    onChange={(event) => updateItem(item.id, { italic: event.target.checked })}
                    className="size-4 accent-blue-700"
                  />
                  <span className="text-xs font-bold text-slate-600">Itálico</span>
                </label>
                <ColorField
                  label="Fundo do bloco"
                  value={item.backgroundColor ?? ""}
                  optional
                  disabled={disabled}
                  onChange={(backgroundColor) =>
                    updateItem(item.id, { backgroundColor: backgroundColor || undefined })
                  }
                />
                <RangeField
                  label="Padding horizontal"
                  value={item.paddingHorizontal ?? item.padding}
                  max={60}
                  disabled={disabled}
                  onChange={(paddingHorizontal) => updateItem(item.id, { paddingHorizontal })}
                />
                <RangeField
                  label="Padding vertical"
                  value={item.paddingVertical ?? 0}
                  max={60}
                  disabled={disabled}
                  onChange={(paddingVertical) => updateItem(item.id, { paddingVertical })}
                />
                <RangeField
                  label="Arredondamento"
                  value={item.borderRadius}
                  max={60}
                  disabled={disabled}
                  onChange={(borderRadius) => updateItem(item.id, { borderRadius })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {contentTypes.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled || items.length >= 20}
            onClick={() => onChange([...items, createContentItem(option.value)])}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
          >
            <Plus size={12} /> {option.label}
          </button>
        ))}
      </div>

      {needsWeather && (
        <label className="mt-4 block">
          <span className="text-xs font-bold text-slate-600">Cidade ou região do clima</span>
          <input
            value={weatherLocation ?? ""}
            disabled={disabled}
            maxLength={120}
            onChange={(event) => onWeatherLocationChange(event.target.value || null)}
            placeholder="Ex.: Rio de Janeiro, RJ"
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500"
          />
          {!weatherLocation?.trim() && (
            <span className="mt-1 block text-[10px] font-semibold text-amber-700">
              Informe a região para atualizar os blocos de clima.
            </span>
          )}
        </label>
      )}
    </fieldset>
  );
}

function createContentItem(type: OverlayBarContentType): OverlayBarContentItem {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    text: type === "TEXT" ? "Nova frase" : undefined,
    textColor: "#FFFFFF",
    fontSize: 28,
    fontWeight: "BOLD",
    fontFamily: "SYSTEM",
    italic: false,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    spacerSize: 24,
  };
}

interface RangeFieldProps {
  label: string;
  value: number;
  min?: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

function RangeField({ label, value, min = 0, max, disabled, onChange }: RangeFieldProps) {
  return (
    <label className="mt-3 block">
      <span className="flex justify-between text-xs font-bold text-slate-600">
        {label} <strong className="text-blue-700">{value}px</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-blue-700"
      />
    </label>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  optional?: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
}

function ColorField({ label, value, optional = false, disabled, onChange }: ColorFieldProps) {
  const color = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#000000";

  return (
    <label>
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={color}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-9 w-11 rounded-lg border border-slate-200 bg-white p-1"
        />
        {optional && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(value ? "" : "#000000")}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-600"
          >
            {value ? "Sem fundo" : "Adicionar fundo"}
          </button>
        )}
      </div>
    </label>
  );
}
