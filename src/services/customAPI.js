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
  const headers = {
    "X-Profile-Image-Key": data.profileImageKey,
    "X-Documents-Key": data.documentsKey.join(","), // Assuming info.documentsKey is an array
  };
  return customAxios.delete(`/deleteVehicle/${data.id}`, { headers });
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
  const headers = {
    "X-Profile-Image-Key": info.profileImageKey,
    "X-Documents-Key": info.documentsKey.join(","), // Assuming info.documentsKey is an array
  };
  return customAxios.delete(`/deleteDriver/${info.id}`, { headers });
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

export const getAllVehiclesApi = () => {
  return customAxios.get("/allAllVehicles");
};


export const handleCreateDriverApi = (id, data) => {
  return customAxios.patch(`/updateDriver/${id}`, data);
};

export const handleCreateApi = (id, data) => {
  return customAxios.patch(`/updateDriver/${id}`, data);
};


export const createDriverApi = (data) => {
  return customAxios.post("/create-driver", data);
};

// vehicle Type

export const createVehicleTypeApi = (data) => {
  return customAxios.post("/create-vehicle-type", data);
};

export const handleCreateVehicleTypeApi = (id, data) => {
  return customAxios.patch(`/updateVehicleType/${id}`, data);
};

export const getVehicleTypeById = (id) => {
  return customAxios.get(`/get-vehicle-type-id/${id}`);
};

export const getVehicleTypeList = () => {
  return customAxios.get("/get-vehicle-type");
};

export const deleteVehicleType = (id) => {
  return customAxios.delete(`/delete-vehicle-type/${id}`);
};

// fare

export const addFare = (data) => {
  return customAxios.post(`/add-fare`,data);
};

export const getFare = () => {
  return customAxios.get(`/get-fare`);
};

export const upDateFare = (id,data) => {
  return customAxios.patch(`/update-fare/${id}`,data);
};


//

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

export const getAppNameAndImage = () => {
  return customAxios.get(`/get-app`);
};

export const handleCreateAppNameAndImageApi = (id, data) => {
  return customAxios.patch(`/update-app/${id}`, data);
};

export const createAppNameAndImageApi = (data) => {
  return customAxios.post("/create-app", data);
};

export const deleteObjectFromS3Api = (data) => {
  return customAxios.post("/delete-object-from-s3", data);
};

// Application flow for driver
 
export const createAppFlowAPI = (data) => {
  return customAxios.post("/create-app-flow", data);
}

export const getFlow = () => {
  return customAxios.get("/get-app-flow");
}

export const updateAppFlowAPI = (id, data) => {
  console.log("123456789098765432", id, data)
  return customAxios.patch(`/update-app-flow/${id}`, data);
};

//spots

export const createSpot = (data) => {
  console.log("data",data)
  return customAxios.post("/create-spot", data);
};

export const getSpotsList = (data) => {
  console.log("getDataApi")
  return customAxios.get(`/get-spot-list?page=${data.page}&limit=${data.limit}`);
};

export const getSpotsListVehicle = () => {
  console.log("getDataApiVehiclespot")
  return customAxios.get(`/get-spot-list-vehicle`);
};

export const deleteSpot = (id) => {
  console.log("deleteSpotApi")
  return customAxios.delete(`/delete-spot/${id}`);
};

export const getActiveSpots = () => {
  return customAxios.get(`/get-active-spot`)
}
// country code APIs

export const createCountryCodeApi = (data) =>{
  return customAxios.post("/create-country-code", data)
}

export const handleCreateCountryCodeApi = (id,data) =>{
  return customAxios.patch(`/update-country-code/${id}`, data)
}


export const getCountryCodes = () =>{
  return customAxios.get("/get-country-code")
}


export const getCountryCodesById = (id) =>{
  return customAxios.get(`/get-country-code/${id}`)
}

export const deleteCoutryCode = (id) => {
  return customAxios.delete(`/delete-country-code/${id}`);
};

// Flows -----------------
export const createBreakPointApi = (data) => {
  console.log("api called : " ,data)
  return customAxios.post("/create-break-points", data)
};

export const getBreakingPoints = (data) => {
  console.log("getBreakingPoints--------------called")
  return customAxios.get(`/get-breaking-points?page=${data.page}&limit=${data.limit}`);
};

export const updateBreakPointApi = (id, data) => {
  console.log("updateBreakPointApi called",id,data)
  return customAxios.patch(`/update-break-points/${id}`, data);
};

export const getBreakPointById = (id) => {
  console.log("getBreakPointById called",id)
  return customAxios.get(`/get-break-point-id/${id}`)
}

export const deleteBreakPoints = (id) => {
  // console.log("deleteBreakPoints")
  return customAxios.delete(`/delete-breakingPoints/${id}`);
};

