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
import { useEffect, useState } from 'react';
import { axiosWithToken } from '../../utils/axiosInstances';
import handleError from '../../utils/HandleErrors';
import { Appointment } from '../../types';
import EditAppointment from '../../components/Calendar/EditAppointment/EditAppointment';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;


const Agenda = () => {

    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState("")
    const [selectedStart, setSelectedStart] = useState("")
    const [selectedEnd, setSelectedEnd] = useState("")
    const [appointments, setAppointments] = useState([])
    const [lastDateRange, setLastDateRange] = useState({ start: null, end: null });
    const [selectedEvent, setSelectedEvent] = useState<number>(0)

    const today = new Date()
    today.setHours(0,0,0)
    const lastDay = new Date(today)
    lastDay.setDate(today.getDate() + 5)
    lastDay.setHours(0,0,0)

    const getEvents = async (startDate: string, endDate: string) => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/appointment/get?startDate=${startDate}&endDate=${endDate}`)
            if(res.data) {
                setAppointments(res.data)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleEventClick = (info: any) => {
        const event = info.event._def
        setModal("edit")
        setShow(true)
        setSelectedEvent(event.publicId)
    }

    const handleDateSet = (info: any) => {
        const startDate = info.start.toISOString();
        const endDate = info.end.toISOString();
    
        if (startDate !== lastDateRange.start || endDate !== lastDateRange.end) {
            setLastDateRange({ start: startDate, end: endDate });
            getEvents(startDate, endDate);
        }
    };

    const handleDateSelection = (selectionInfo: any) => {
        setModal("add")

        setSelectedStart(selectionInfo.start.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(' ', 'T'))

        selectionInfo.end && setSelectedEnd(selectionInfo.end.toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(' ', 'T'))

        setShow(true)
    }

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>

            <div className='text-light bg-dark-700 p-2 rounded'>
                <FullCalendar
                    plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin]}
                    locale={esLocale}
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: false
                    }}
                    themeSystem='bootstrap5'
                    initialView='timeGridWeek'
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
                        left: 'timeGridWeek,timeGridDay',
                        center: 'title',
                        right: 'prev,next'
                    }
                    }
                    events={appointments}
                />
            </div>
            {show && modal === "add" &&
                <CustomModal title={"Agendar cita"}>
                    <AddAppointment start={selectedStart} end={selectedEnd} updateEvents={() => getEvents(today.toISOString(), lastDay.toISOString())}></AddAppointment>
                </CustomModal>
            }
            {show && modal === "edit" &&
                <CustomModal title={"Detalle de cita"}>
                    <EditAppointment id={selectedEvent} updateEvents={() => getEvents(today.toISOString(), lastDay.toISOString())}></EditAppointment>
                </CustomModal>
            }
        </div>
    )
}

export default Agenda