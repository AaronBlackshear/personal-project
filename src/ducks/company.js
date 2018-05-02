import axios from "axios";
const initialState = {
  loading: false,
  companys: [],
  jobs: [],
  currentCompanyLatitude: 0,
  currentCompanyLongitude: 0,
  currentCompanyId: "",
  currentCompanyEmployeeId: "",
  currentCompanyName: "",
  createCompanyLatitude: "",
  createCompanyLongitude: "",
  currentCompanyIdForDate: "",
  selectDefaultCompanyId: "",
  modifiedCompanys: "",
  currentCompanyManager: null
};

const CREATE_GROUP = "CREATE_GROUP";
const GET_COMPANY = "GET_COMPANY";
const GET_ALL_JOBS = "GET_ALL_JOBS";
const SET_DIRECTIONS = "GET_DIRECTIONS";
const SET_TRAFFIC = "GET_TRAFFIC";
const GET_LAT_LONG = "GET_LAT_LONG";
const PRE_SET_CREATE = "PRE_SET_CREATE";
const UPDATE_STATE_COMP_ID = "UPDATE_STATE_COMP_ID";

export default function company(state = initialState, action) {
  switch (action.type) {
    //create group
    case `${CREATE_GROUP}_PENDING`:
      return { ...state, loading: true };
    case `${CREATE_GROUP}_FULFILLED`:
      console.log(action.payload.data);
      return { ...state, loading: false };

    case UPDATE_STATE_COMP_ID:
      return { ...state, currentCompanyIdForDate: action.payload };
    //UPDATING CURRENT COMPANY LATITUDE AND LONGITUDE

    //get company
    case `${GET_LAT_LONG}_PENDING`:
    case `${SET_DIRECTIONS}_PENDING`:
    case `${SET_TRAFFIC}_PENDING`:
    case `${GET_COMPANY}_PENDING`:
      console.log("pending get company");
      return { ...state, loading: true };
    case `${GET_COMPANY}_FULFILLED`:
      console.log(action.payload.data.slice(1));
      console.log(action.payload.data);
      let newPayload = action.payload.data.slice(1);
      if (!action.payload.data.length) {
        return { ...state };
      } else {
        return {
          ...state,
          modifiedCompanys: newPayload,
          companys: action.payload.data,
          selectDefaultCompanyId: action.payload.data[0].company_id,
          currentCompanyName: action.payload.data[0].name,
          currentCompanyLatitude: action.payload.data[0].latitude,
          currentCompanyLongitude: action.payload.data[0].longitude,
          currentCompanyManager:
            action.payload.data[0].manager === null ||
            action.payload.data[0].manager === 0
              ? false
              : true,
          loading: false
        };
      }

    //GETTING LAT AND LONG FROM LOCATION INPUT
    case `${GET_LAT_LONG}_FULFILLED`:
      console.log(state.name);
      return {
        ...state,
        createCompanyLatitude: action.payload.data[0].latitude,
        createCompanyLongitude: action.payload.data[0].longitude
      };

    //SET TRAFFIC FOR A CERTAIN COMPANY
    case `${SET_TRAFFIC}_FULFILLED`:
      console.log(
        `SET TRAFFIC FULFILLED HERE IS THE PAYLOAD ${action.payload.data}`
      );
      return {
        ...state,
        currentCompanyLatitude: action.payload.data[0].latitude,
        currentCompanyLongitude: action.payload.data[0].longitude
      };
    //SET DIRECTIONS FOR A CERTAIN COMPANY
    case `${SET_DIRECTIONS}_FULFILLED`:
      console.log(`SET DIRECTIONS FULFILLED HERE IS THE PAYLOAD`);
      console.log(action.payload.data);
      return {
        ...state,
        currentCompanyLatitude: action.payload.data[0].latitude,
        currentCompanyLongitude: action.payload.data[0].longitude
      };

    //GET ALL JOBS ON THE SITE
    case `${GET_ALL_JOBS}_PENDING`:
      return { ...state, loading: true };
    case `${GET_ALL_JOBS}_FULFILLED`:
      return { ...state, jobs: action.payload.data, loading: false };

    //DEFAULT
    default:
      return state;
  }
}

//ACTIONS

export function updateStateCompId(val) {
  return {
    type: UPDATE_STATE_COMP_ID,
    payload: val
  };
}

export function createGroup(name, founded, founder, lat, long, location) {
  console.log("CREATE GROUP HITTTTKSJFSLKDJSLKJDFSKLJ");
  console.log(lat);
  console.log(long);
  return {
    type: CREATE_GROUP,
    payload: axios.post("/createcompany", {
      name,
      founded,
      founder,
      lat,
      long,
      location
    })
  };
}

export function getLatLong(location) {
  return {
    type: GET_LAT_LONG,
    payload: axios.post("/job/location/convert", { location })
  };
}

export function getCompany(userid) {
  return {
    type: GET_COMPANY,
    payload: axios.get(`/company/?userid=${userid}`)
  };
}
export function getJobs() {
  return {
    type: GET_ALL_JOBS,
    payload: axios.get("/alljobs")
  };
}
export function setDirections(companyid) {
  return {
    type: SET_DIRECTIONS,
    payload: axios.get(`/job/location/${companyid}`)
  };
}
export function setTraffic(companyId) {
  return {
    type: SET_TRAFFIC,
    payload: axios.get(`/job/location/${companyId}`)
  };
}
