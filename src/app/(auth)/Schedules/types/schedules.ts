export type Schedule = {
  id: string;

  name: string;
  companyId: string;

  deviceId: string;
  playlistId: string;

  startDate: string;
  endDate: string;

  startTime: string;
  endTime: string;

  daysOfWeek: string; // "0,1,2,3,4,5,6"

  priority: number;

  device?: {
    id: string;
    name: string;
  };

  playlist?: {
    id: string;
    name: string;
    companyId: string;
  };
};

export type CreateScheduleDTO = {
  name: string;

  companyId?: string;

  deviceId: string;
  playlistId: string;

  startDate: string;
  endDate: string;

  startTime: string;
  endTime: string;

  daysOfWeek: string;

  priority: number;
};