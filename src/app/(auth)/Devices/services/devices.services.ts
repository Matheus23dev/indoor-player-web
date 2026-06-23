import instance from "../../../../services/axios";

export async function getDevices() {
  const response =
    await instance.get("/devices");

  return response.data;
}

export async function pairDevice(
  code: string,
  name: string,
) {
  const response =
    await instance.post(
      "/devices/pair",
      {
        code,
        name,
      },
    );

  return response.data;
}