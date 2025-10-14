import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'
import AddAppointment from '../../components/Calendar/AddAppointment/AddAppointment';
import CustomModal from '../../components/Modal/CustomModal';
import { modalState } from '../../app/store';
import { useRecoilState } from "recoil"
import { useEffect, useRef, useState } from 'react';
import { axiosWithToken } from '../../utils/axiosInstances';
import handleError from '../../utils/HandleErrors';
import { Appointment } from '../../types';
import EditAppointment from '../../components/Calendar/EditAppointment/EditAppointment';
import { Button, Col, Row, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Agenda = () => {
    const [show, setShow] = useRecoilState(modalState);
    const [modal, setModal] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [lastDateRange, setLastDateRange] = useState({ start: null, end: null });
    const [selectedEvent, setSelectedEvent] = useState<number>(0);
    const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [activeDate, setActiveDate] = useState(new Date());
    const lastActiveDateRef = useRef<Date | null>(null);


    const today = new Date();
    today.setHours(0, 0, 0);
    const lastDay = new Date(today);
    lastDay.setDate(today.getDate() + 5);
    lastDay.setHours(0, 0, 0);

    const getEvents = async (startDate: string, endDate: string) => {
        try {
            const res = await axiosWithToken.get(
                `${SERVER_URL}/api/appointment/get?startDate=${startDate}&endDate=${endDate}`
            );
            if (res.data) setAppointments(res.data);
        } catch (error) {
            handleError(error);
        }
    };

    const handleEventClick = (info: any) => {
        const event = info.event._def;
        setModal("edit");
        setShow(true);
        setSelectedEvent(event.publicId);
    };

    const handleDateSet = (info: any) => {
        const startDate = info.start.toISOString();
        const endDate = info.end.toISOString();

        const viewType = info.view.type;
        let newActiveDate: Date;

        if (viewType === "timeGridDay") {
            newActiveDate = info.start;
        } else {
            const today = new Date();
            if (today >= info.start && today < info.end) {
                newActiveDate = today;
            } else {
                newActiveDate = info.start;
            }
        }
        if (
            !lastActiveDateRef.current ||
            lastActiveDateRef.current.toDateString() !== newActiveDate.toDateString()
        ) {
            lastActiveDateRef.current = newActiveDate;
            setActiveDate(newActiveDate);
        }

        if (startDate !== lastDateRange.start || endDate !== lastDateRange.end) {
            setLastDateRange({ start: startDate, end: endDate });
            getEvents(startDate, endDate);
        }
    };


    const handleDateSelection = (selectionInfo: any) => {
        setModal("add");
        setSelectedStart(
            selectionInfo.start
                .toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
                .replace(" ", "T")
        );

        selectionInfo.end &&
            setSelectedEnd(
                selectionInfo.end
                    .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })
                    .replace(" ", "T")
            );

        setShow(true);
    };

    return (
        <div className="container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto" style={{ minHeight: "85vh" }}>
            {/* 🔹 Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-light m-0">Agenda de turnos</h5>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                        setModal("add");
                        setShow(true);
                        setSelectedStart("");
                        setSelectedEnd("");
                    }}
                >
                    + Nuevo turno
                </Button>
            </div>

            {/* 🔹 Calendario */}
            <div className="text-light bg-dark-700 p-2 rounded mb-4">
                <FullCalendar
                    plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin]}
                    locale={esLocale}
                    slotLabelFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        meridiem: false,
                    }}
                    themeSystem="bootstrap5"
                    initialView="timeGridDay"
                    selectable={true}
                    hiddenDays={[0]}
                    allDaySlot={false}
                    slotDuration="00:30"
                    slotLabelInterval={"00:30"}
                    slotMinTime={"08:00"}
                    slotMaxTime={"21:30"}
                    nowIndicator={true}
                    eventClick={(info) => handleEventClick(info)}
                    select={(selectionInfo) => handleDateSelection(selectionInfo)}
                    datesSet={(dateInfo) => handleDateSet(dateInfo)}
                    headerToolbar={{
                        left: "timeGridWeek,timeGridDay",
                        center: "title",
                        right: "prev,next",
                    }}
                    events={appointments}
                    expandRows={true}

                />
            </div>

            {/* 🔹 Tabla debajo */}
            <div className="bg-dark-700 text-light rounded mt-3 p-3">
                <h6 className="mb-3">
                    Turnos del día –{" "}
                    {activeDate.toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </h6>
                <Table striped bordered hover variant="dark" size="sm" responsive>
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Paciente</th>
                            <th>Teléfono</th>
                            <th>Título</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments
                            .filter((app: any) => {
                                const appDate = new Date(app.start).toLocaleDateString("sv-SE");
                                const tableDate = activeDate.toLocaleDateString("sv-SE");
                                return appDate === tableDate;
                            })
                            .sort((a: any, b: any) => a.start.localeCompare(b.start))
                            .map((app: any, i: number) => (
                                <tr key={i}>
                                    <td>
                                        {new Date(app.start).toLocaleTimeString("es-AR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td>{app.name}</td>
                                    <td>{app.phone}</td>
                                    <td>{app.title}</td>
                                    <td>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => {
                                                setModal("edit");
                                                setSelectedEvent(app.id);
                                                setShow(true);
                                            }}
                                        >
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        {appointments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-light">
                                    No hay turnos para hoy
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* 🔹 Modales */}
            {show && modal === "add" && (
                <CustomModal title={"Agendar cita"}>
                    <AddAppointment
                        start={selectedStart}
                        end={selectedEnd}
                        updateEvents={() => getEvents(today.toISOString(), lastDay.toISOString())}
                    />
                </CustomModal>
            )}

            {show && modal === "edit" && (
                <CustomModal title={"Detalle de cita"}>
                    <EditAppointment
                        id={selectedEvent}
                        updateEvents={() => getEvents(today.toISOString(), lastDay.toISOString())}
                    />
                </CustomModal>
            )}
        </div>
    );
};

export default Agenda;