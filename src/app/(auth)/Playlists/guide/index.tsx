import {
  ArrowLeft,
  Clock3,
  GripVertical,
  ImageIcon,
  Images,
  Layers3,
  Monitor,
  Plus,
  Save,
  Smartphone,
  Video,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageContainer, PageScrollArea } from "../../../../components/layout/Page";

export default function PlaylistCompositionGuide() {
  const navigate = useNavigate();

  return (
    <PageContainer scrollable>
      <header
        data-help-tour="composition-actions"
        className="flex flex-col justify-between gap-3 rounded-2xl border border-blue-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center"
      >
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/home/playlists")}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
            aria-label="Voltar às playlists"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                Composição da playlist
              </p>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
                Dados de exemplo
              </span>
            </div>
            <h1 className="mt-0.5 text-2xl font-bold text-slate-950">Campanha da recepção</h1>
            <p className="mt-1 text-sm text-slate-500">
              Este exemplo não altera nem salva informações na sua empresa.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs font-bold text-blue-700 shadow-sm ring-1 ring-slate-200">
              <Monitor size={15} /> Horizontal
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-slate-500">
              <Smartphone size={15} /> Vertical
            </span>
          </div>
          <button
            data-help-tour="composition-bars"
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700"
          >
            <Layers3 size={17} /> Barras (1)
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white"
          >
            <Plus size={18} /> Adicionar mídia
          </button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumo de exemplo">
        <GuideMetric icon={<Images size={20} />} label="Mídias" value="2" />
        <GuideMetric icon={<Clock3 size={20} />} label="Duração total" value="00:00:23" />
        <GuideMetric icon={<Clock3 size={20} />} label="Agendamentos" value="1" />
        <GuideMetric icon={<Layers3 size={20} />} label="Barras fixas" value="1" />
      </section>

      <PageScrollArea ariaLabel="Exemplo da composição" className="space-y-3 pb-5">
        <GuideMediaCard
          tourId="composition-image-settings"
          order={1}
          title="Oferta da semana.jpg"
          type="Imagem"
          accent="from-blue-500 to-cyan-400"
        >
          <div className="flex h-8 items-center rounded-md border border-slate-200 bg-white">
            <span className="border-r border-slate-200 px-2 text-[10px] font-bold text-slate-500">
              Exibição
            </span>
            <span className="px-3 text-xs font-extrabold text-slate-900">8 seg</span>
          </div>
        </GuideMediaCard>

        <GuideMediaCard
          tourId="composition-video-settings"
          order={2}
          title="Vídeo institucional.mp4"
          type="Vídeo"
          accent="from-violet-600 to-blue-500"
        >
          <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-bold text-emerald-700">
            <Volume2 size={14} /> Com áudio
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-600">
            <Clock3 size={13} /> Duração do arquivo: 00:15
          </span>
        </GuideMediaCard>
      </PageScrollArea>
    </PageContainer>
  );
}

function GuideMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">{icon}</span>
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <strong className="mt-0.5 block text-lg text-slate-950">{value}</strong>
        </div>
      </div>
    </article>
  );
}

function GuideMediaCard({
  tourId,
  order,
  title,
  type,
  accent,
  children,
}: {
  tourId: string;
  order: number;
  title: string;
  type: string;
  accent: string;
  children: React.ReactNode;
}) {
  const TypeIcon = type === "Vídeo" ? Video : ImageIcon;

  return (
    <article
      data-help-tour={tourId}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="grid md:grid-cols-[190px_1fr]">
        <div
          className={`relative flex min-h-32 items-center justify-center bg-gradient-to-br ${accent}`}
        >
          <TypeIcon className="text-white/90" size={40} />
          <span className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 text-xs font-black text-white">
            {order}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-950">{title}</h2>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                <TypeIcon size={14} /> {type}
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-xs font-bold text-blue-700">
              <GripVertical size={16} /> Arrastar
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            {children}
            <span className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-200 px-3 text-[10px] font-bold text-slate-500">
              <Save size={13} /> Salvo
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
