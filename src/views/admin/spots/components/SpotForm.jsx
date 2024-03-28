import { MapContainer, TileLayer, Marker, Popup, Rectangle, Map, FeatureGroup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L, { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import '../map.css'
import Select from "react-select";
import { EditControl } from 'react-leaflet-draw'
import { Navigate, useNavigate } from "react-router-dom";
import '../../../../../node_modules/leaflet/dist/leaflet.css'
import '../../../../../node_modules/leaflet-draw/dist/leaflet.draw.css'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import LocationPin from '../../../../assets/svg/LocationPinAdd.svg'
import './SpotForm.css'
import { createSpot } from 'services/customAPI';
import { getAvailableVehiclesApi } from 'services/customAPI';

const icon = L.icon({
    iconUrl: LocationPin,
    iconSize: [40, 40]
})


const SpotForm = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ input1: '', input2: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [bounds, setBounds] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [allAvailableVehicles, setAllAvailableVehicles] = useState([]);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [options, setOptions] = useState([
        {
            value: "",
            label: "",
        },
    ]);


    const isSpotNameFilled = inputs.input1.trim() !== '';



    const addMarker = (pos) => {
        setMarkers((prevMarkers) => [...prevMarkers, pos]);
        setBounds([{ lat: pos[0], lng: pos[1] }])
        setShowPopup(true)
    };

    const getAvailableVehicles = async () => {
        try {
            const res = await getAvailableVehiclesApi();
            if (!res) {
                errorToast("Vehicles not available");
            }
            setOptions(
                res.data
                    .filter(option => !option.spotName) // Filter out options with spotName present
                    .map(option => {
                        return {
                            value: option.vehicleNumber,
                            label: option.vehicleNumber,
                        };
                    })
            );
            setAllAvailableVehicles(res.data);
        } catch (error) {
            errorToast(error.response.data.message);
        }
    };

    const removeLastMarker = () => {
        setInputs({ input1: '', input2: '' })
        setVehicleNumber('')
        setMarkers((prevMarkers) => prevMarkers.slice(0, prevMarkers.length - 1));
    };
    // function _onCreate(e)removeLastMarker {
    //     // Get the drawn shape
    //     const { layer } = e;
    //     console.log("layer", layer._latlng)
    //     const bounds = layer._latlng; // Assuming `layer` is your Rectangle or LatLngBounds object
    //     setBounds(bounds)
    //     setShowPopup(true)
    // }

    const successToast = (message) => {
        toast.success(`${message}`, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { borderRadius: "15px" },
        });
    };

    const errorToast = (message) => {
        toast.error(`${message}`, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            style: { borderRadius: "15px" },
        });
    };

    // const handleClickOnMap = () => {
    //     if (showPopup) {
    //         setShowPopup(false);
    //         removeLastMarker();
    //     } else {
    //         // setShowPopup(false);
    //     }
    // };

    // Function to handle submission from popup input box
    async function _onSubmit() {
        const spotName = inputs.input1;
        try {
            const resp = await createSpot({ bounds, spotName, vehicleNumber });
            setInputs({ input1: '', input2: '' })
            successToast("Spot added Successfully");
            setShowPopup(false)
        } catch (error) {
            console.log("error", error)
            errorToast(error.response.data.message);
        }
    }

    function DropMarker({ addMarker }) {
        const [position, setPosition] = useState(null);

        const map = useMapEvents({
            click: (e) => {
                if (!position) {
                    setPosition([e.latlng.lat, e.latlng.lng]);
                }
            },
        });

        useEffect(() => {
            if (position !== null) {
                addMarker(position);
                setPosition(null);
            }
        }, [position, addMarker]);

        return position ? (
            <Circle center={position} radius={100} color="red" fillColor="#f03" opacity={0.5}>
                <Popup minWidth={90}>You clicked here!</Popup>
            </Circle>
        ) : null;
    };

    useEffect(() => {
        getAvailableVehicles();
    }, []);



    return (
        <div className="w-full pb-0 p-4 bg-white rounded-lg pt-0 pe-0 h-[100vh] mt-5 mb-5 grid grid-cols-12 gap-4">
            <header className="relative flex items-center justify-between col-span-12 mt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                    Add Spots
                </div>
                <div>
                    {/* <button
                        className="my-sm-0 add-spot-button my-2 ms-1 bg-brand-500 dark:bg-brand-400 mr-3 mt-4"
                        type="submit"
                        onClick={() => navigate("/admin/default/spot/spot-form")}
                    >
                        Add Spots
                    </button> */}
                </div>
            </header>
            <div className="col-span-12 overflow-hidden mb-5">
                <div className={`w-full h-full pr-4`}>
                    <div className={`z-10 ${showPopup ? 'blur' : ''}`} onClick={showPopup ? () => {
                        setShowPopup(false);
                        removeLastMarker();
                    } : undefined}>
                        <MapContainer center={[19.07, 72.87]} zoom={12} className={`z-10`} onClick={() => {
                            if (showPopup) {
                                setShowPopup(false)
                                removeLastMarker()
                            }
                        }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {/* <FeatureGroup>
                            <EditControl
                                position='topright'
                                onEdited={_onEditPath}
                                onCreated={_onCreate}
                                onDeleted={_onDeleted}
                                draw={{
                                    rectangle: false,
                                    polygon: false,
                                    circle: false,
                                    circlemarker: false,
                                    marker: { icon: icon },
                                }}
                            />
                        </FeatureGroup> */}
                            {markers.map((pos, index) => (
                                <Marker key={index} position={pos} icon={icon}>
                                    <Popup>This is marker #{index + 1}</Popup>
                                </Marker>
                            ))}
                            <DropMarker addMarker={addMarker} />
                        </MapContainer>
                    </div>

                    {showPopup && (
                        <div className="popup flex flex-col justify-between z-20 w-[25vw] absolute p-7 bg-white border rounded-2xl shadow">
                            <label htmlFor="input1" className='text-center text-xl font-Poppins font-bold'>Enter Spot Name</label>

                            <input
                                type="text"
                                id="input1"
                                className="mt-2 h-12 w-full border bg-white/0 text-sm outline-none"
                                placeholder=" Enter spot name here"
                                value={inputs.input1}
                                onChange={e => setInputs({ ...inputs, input1: e.target.value })}
                            />

                            {!isSpotNameFilled && <p className="text-red-500 text-sm mt-1">Please fill the spot name</p>}

                            {/* <input
                                type="text"
                                id="input2"
                                className="h-12 w-full border bg-white/0 text-sm outline-none"
                                placeholder=" Enter vehicle Number here"
                                value={inputs.input2}
                                onChange={e => setInputs({ ...inputs, input2: e.target.value })}
                            /> */}
                            <Select
                                options={options}
                                id="vehicleNumber"
                                name="vehicleNumber"
                                className="mb-5"
                                // onBlur={handleBlur}
                                onChange={(e) => {
                                    setVehicleNumber(e.value);
                                    // values.vehicleNumber = e.value;
                                }}
                                value={options.filter(function (option) {
                                    return option.value == vehicleNumber;
                                })}
                                placeholder="Vehicle number"
                                styles={{
                                    // Fixes the overlapping problem of the component
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        height: "47px", // Adjust the height as needed
                                        marginTop: "8px",
                                        fontSize: "0.875rem",
                                        borderColor: "#e6e6e6",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isSelected
                                            ? "#f2f3f7"
                                            : "white", // Change the background color here
                                        color: "black", // Change the text color here
                                        "&:hover": {
                                            backgroundColor: "#f2f3f7", // Change the background color on hover
                                        },
                                    }),
                                }}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                            />
                            <div className="flex justify-center gap-2">
                                <button className='rounded-xl w-[7vw] h-[8vh]' onClick={_onSubmit} disabled={!isSpotNameFilled}>Confirm</button>
                                {/* <button className='rounded-xl w-[7vw] h-[8vh]' onClick={() => { _onSubmit() }}>Confirm</button> */}
                                <button className='rounded-xl w-[7vw] h-[8vh]' onClick={() => {
                                    setShowPopup(false)
                                    removeLastMarker()
                                }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default SpotForm;
const columnHelper = createColumnHelper();
