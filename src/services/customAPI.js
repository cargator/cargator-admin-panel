import customAxios from "./appservices";

export const dashboardDataApi = () => {
  return customAxios.get(`/dashboard-data`);
};

export const handleLoginApi = (data) => {
  return customAxios.post("/admin-login", data);
};

export const handleRegisterApi = (data) => {
  return customAxios.post("/admin-register", data);
};

export const handleChangePasswordApi = (data) => {
  return customAxios.post("/change-password", data);
};
export const onlineDriversApi = () => {
  return customAxios.get(`/onlineDrivers`);
};
export const getAllRidesApi = (data) => {
  return customAxios.get(
    `/get-all-rides?page=${data.page}&limit=${data.limit}`
  );
};

export const getCurrentRidesApi = (data) => {
  return customAxios.get(
    `/get-current-rides?page=${data.page}&limit=${data.limit}`
  );
};

export const getRidesByFilterApi = (data) => {
  return customAxios.get(
    `/get-rides-by-filter?page=${data.page}&limit=${data.limit}&filter=${data.filter}`
  );
};

export const searchRidesApi = (data) => {
  return customAxios.get(
    `/search-ride?page=${data.page}&limit=${data.limit}&query=${data.query}`
  );
};

export const searchDriversApi = (data) => {
  return customAxios.get(
    `/search-drivers?page=${data.page}&limit=${data.limit}&query=${data.query}`
  );
};

export const getRideDetailsApi = (id) => {
  return customAxios.get(`/get-ride-details/${id}`);
};

export const deleteVehicleApi = (data) => {
  return customAxios.post(`/deleteVehicle`, data);
};

export const getPaginatedVehicleDataApi = (data) => {
  return customAxios.get(
    `/paginatedVehicleData?page=${data.page}&limit=${data.limit}`
  );
};

export const getPaginatedRidesDataApi = (data) => {
  return customAxios.post(`/paginatedRidesData`, data);
};

export const getPaginatedRidersDataApi = (data) => {
  return customAxios.post(`/paginatedRidersData`, data);
};

export const searchVehiclesApi = (data) => {
  return customAxios.get(
    `/search-vehicles?page=${data.page}&limit=${data.limit}&query=${data.query}`
  );
};

export const deleteDriverHandleApi = (info) => {
  return customAxios.post(`/deleteDriver`, info);
};

export const getPaginatedDriverDataApi = (data) => {
  return customAxios.get(
    `/paginatedDriverData?page=${data.page}&limit=${data.limit}`
  );
};

export const updateDriverStatusApi = (id) => {
  return customAxios.patch(`/update-driver-status/${id}`);
};

export const searchDriverApi = (data) => {
  return customAxios.post(`/search-drivers`, data);
};

export const getDriverLocationApi = (data) => {
  return customAxios.post(`/get-driver-location`, data);
};

export const getAvailableVehiclesApi = () => {
  return customAxios.get("/allAvailableVehicles");
};

export const handleCreateDriverApi = (id, data) => {
  return customAxios.patch(`/updateDriver/${id}`, data);
};

export const createDriverApi = (data) => {
  return customAxios.post("/create-driver", data);
};

export const getDriverByIdApi = (id) => {
  console.log("Params1>>", id);
  return customAxios.get(`/getDriverById/${id}`);
};

export const handleCreateVehicleApi = (id, data) => {
  return customAxios.patch(`/updateVehicle/${id}`, data);
};

export const createVehicleApi = (data) => {
  return customAxios.post("/create-vehicle", data);
};

export const getVehicleByIdApi = (id) => {
  return customAxios.get(`/getVehicleById/${id}`);
};

export const searchRidersByNameApi = (data) => {
  return customAxios.post(`/search-riders-by-name`, data);
};

export const updateRiderStatusApi = (data) => {
  return customAxios.patch(`/update-rider-status`, data);
};

export const handleRiderDeleteApi = (id) => {
  return customAxios.delete(`/deleteRider/${id}`);
};

export const getAllRidersApi = (data) => {
  return customAxios.get(
    `/get-all-riders?page=${data.page}&limit=${data.limit}`
  );
};

export const searchRidersApi = (data) => {
  return customAxios.get(
    `/search-riders-by-name?page=${data.page}&limit=${data.limit}&query=${data.query}`
  );
};

export const chatGptAPi = (data) => {
  return customAxios.post(`/chat-gpt-api`, data);
};

export const getS3SignUrlApi = (data, headers) => {
  return customAxios.post(`/presignedurl`, data, headers);
};

export const deleteObjectFromS3Api = (data) => {
  return customAxios.post("/delete-object-from-s3", data);
};
