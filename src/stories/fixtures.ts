import type { Device, DevicePreview } from "@/app/(auth)/Devices/types/device";
import type { Folder, Media } from "@/app/(auth)/Medias/types";
import type { OverlayBar } from "@/app/(auth)/OverlayBars/types";
import type { Playlist, PlaylistItem } from "@/app/(auth)/Playlists/types";
import type { Schedule } from "@/app/(auth)/Schedules/types";

const createdAt = "2026-08-20T12:00:00.000Z";
const updatedAt = "2026-08-24T12:00:00.000Z";

export const sampleImageUrl = new URL("../assets/images/monitor-tijuca.png", import.meta.url).href;

export const sampleFolder: Folder = {
  id: "folder-campaigns",
  name: "Campanhas institucionais",
  companyId: "company-demo",
  createdAt,
  updatedAt,
  _count: { medias: 12 },
};

export const sampleImage: Media = {
  id: "media-image",
  name: "Campanha de boas-vindas.png",
  type: "IMAGE",
  fileUrl: sampleImageUrl,
  fileSize: 1_843_200,
  duration: null,
  hasAudio: null,
  companyId: "company-demo",
  folderId: sampleFolder.id,
  folder: { id: sampleFolder.id, name: sampleFolder.name },
  createdAt,
  updatedAt,
  _count: { playlistItems: 3 },
};

export const sampleVideo: Media = {
  id: "media-video",
  name: "Vídeo promocional.mp4",
  type: "VIDEO",
  fileUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  fileSize: 8_912_896,
  duration: 42,
  hasAudio: true,
  companyId: "company-demo",
  folderId: sampleFolder.id,
  folder: { id: sampleFolder.id, name: sampleFolder.name },
  createdAt,
  updatedAt,
  _count: { playlistItems: 2 },
};

export const sampleSilentVideo: Media = {
  ...sampleVideo,
  id: "media-video-silent",
  name: "Animação sem áudio.mp4",
  hasAudio: false,
};

export const sampleBottomBar: OverlayBar = {
  id: "bar-bottom",
  name: "Rodapé institucional",
  position: "BOTTOM",
  sizePercent: 13,
  backgroundColor: "#075985",
  opacity: 96,
  fit: "CONTAIN",
  contentPosition: "CENTER",
  contentAlignment: "CENTER",
  imageSizePercent: 76,
  contentPadding: 18,
  contentGap: 28,
  contentItems: [
    {
      id: "bar-text",
      type: "TEXT",
      text: "Bem-vindo à nossa empresa",
      textColor: "#FFFFFF",
      fontSize: 30,
      fontWeight: "BOLD",
      fontFamily: "SANS_SERIF",
      italic: false,
      backgroundColor: "transparent",
      padding: 0,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 0,
      spacerSize: 24,
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: "bar-clock",
      type: "CLOCK",
      textColor: "#BAE6FD",
      fontSize: 28,
      fontWeight: "SEMIBOLD",
      fontFamily: "MONOSPACE",
      italic: false,
      padding: 0,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 0,
      spacerSize: 24,
      offsetX: 0,
      offsetY: 0,
    },
  ],
  textContent: null,
  textColor: "#FFFFFF",
  fontSize: 28,
  widgetType: "NONE",
  weatherLocation: "Recife, PE",
  companyId: "company-demo",
  mediaId: null,
  media: null,
  playlists: [
    {
      order: 0,
      createdAt,
      playlist: { id: "playlist-demo", name: "Programação principal" },
    },
  ],
  _count: { playlists: 3 },
  createdAt,
  updatedAt,
};

export const sampleLeftBar: OverlayBar = {
  ...sampleBottomBar,
  id: "bar-left",
  name: "Lateral com identidade visual",
  position: "LEFT",
  sizePercent: 13,
  backgroundColor: "#0F172A",
  contentPosition: "CENTER",
  contentAlignment: "CENTER",
  contentPadding: 22,
  contentGap: 18,
  contentItems: [
    {
      id: "bar-image",
      type: "IMAGE",
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
      mediaId: sampleImage.id,
      media: sampleImage,
      imageSizePercent: 92,
      fit: "CONTAIN",
      offsetX: 0,
      offsetY: 0,
    },
    {
      id: "bar-date",
      type: "DATE",
      textColor: "#E0F2FE",
      fontSize: 24,
      fontWeight: "SEMIBOLD",
      fontFamily: "MONOSPACE",
      italic: false,
      padding: 0,
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderRadius: 0,
      spacerSize: 24,
      offsetX: 0,
      offsetY: 0,
    },
  ],
  _count: { playlists: 2 },
};

export const samplePlaylistItem: PlaylistItem = {
  id: "playlist-item-image",
  playlistId: "playlist-demo",
  mediaId: sampleImage.id,
  order: 0,
  duration: 8,
  muted: null,
  createdAt,
  media: sampleImage,
};

export const sampleVideoPlaylistItem: PlaylistItem = {
  id: "playlist-item-video",
  playlistId: "playlist-demo",
  mediaId: sampleVideo.id,
  order: 1,
  duration: null,
  muted: false,
  createdAt,
  media: sampleVideo,
};

export const samplePlaylist: Playlist = {
  id: "playlist-demo",
  name: "Programação principal da recepção",
  orientation: "LANDSCAPE",
  companyId: "company-demo",
  createdAt,
  updatedAt,
  items: [samplePlaylistItem, sampleVideoPlaylistItem],
  overlayBars: [
    {
      playlistId: "playlist-demo",
      overlayBarId: sampleBottomBar.id,
      order: 0,
      createdAt,
      overlayBar: sampleBottomBar,
    },
  ],
  schedules: [],
  _count: { items: 2, overlayBars: 1, schedules: 4 },
};

export const sampleDevicePreview: DevicePreview = {
  schedule: {
    id: "schedule-demo",
    name: "Horário comercial",
    startTime: "08:00",
    endTime: "18:00",
    priority: 1,
  },
  playlist: {
    id: samplePlaylist.id,
    name: samplePlaylist.name,
    orientation: "LANDSCAPE",
    bars: [sampleBottomBar],
  },
  item: { id: samplePlaylistItem.id, order: 0 },
  media: {
    id: sampleImage.id,
    name: sampleImage.name,
    type: sampleImage.type,
    fileUrl: sampleImage.fileUrl,
    duration: 8,
  },
  playback: {
    currentTime: 3,
    duration: 8,
    progress: 37.5,
    muted: null,
    startedAt: "2026-08-24T12:00:00.000Z",
    updatedAt: "2026-08-24T12:00:03.000Z",
  },
};

export const sampleDevice: Device = {
  id: "device-demo",
  name: "TV da recepção",
  code: "J9AM5O",
  isLinked: true,
  status: "ONLINE",
  lastHeartbeat: new Date(Date.now() - 25_000).toISOString(),
  companyId: "company-demo",
  createdAt,
  updatedAt,
  preview: sampleDevicePreview,
};

export const sampleSchedule: Schedule = {
  id: "schedule-demo",
  name: "Horário comercial",
  companyId: "company-demo",
  deviceId: sampleDevice.id,
  playlistId: samplePlaylist.id,
  startDate: "2026-08-01",
  endDate: "2026-12-31",
  startTime: "08:00",
  endTime: "18:00",
  daysOfWeek: "1,2,3,4,5",
  priority: 1,
  active: true,
  createdAt,
  updatedAt,
  device: {
    id: sampleDevice.id,
    name: sampleDevice.name,
    code: sampleDevice.code,
    isLinked: true,
    status: "ONLINE",
    companyId: "company-demo",
    lastHeartbeat: sampleDevice.lastHeartbeat,
    createdAt,
    updatedAt,
  },
  playlist: {
    id: samplePlaylist.id,
    name: samplePlaylist.name,
    companyId: "company-demo",
    createdAt,
    updatedAt,
    _count: { items: 2, schedules: 4 },
  },
};
