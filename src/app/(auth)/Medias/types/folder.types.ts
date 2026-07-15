export interface FolderMediaCount {
  medias: number;
}

export interface Folder {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  _count?: FolderMediaCount;
}

export interface FolderPayload {
  name: string;
}

export interface RemoveFolderResponse {
  success: boolean;
  message: string;
  mediasMovedToRoot: number;
}
