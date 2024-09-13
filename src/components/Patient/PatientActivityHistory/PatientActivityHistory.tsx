import { useEffect, useState } from "react"
import { axiosWithToken } from "../../../utils/axiosInstances"
import handleError from "../../../utils/HandleErrors"
import type { ActivityHistory } from "../../../types";
import { Table } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientActivityHistoryProps {
    patientId: number
    inChargeOfId: number,
}

const PatientActivityHistory: React.FC<PatientActivityHistoryProps> = ({ patientId, inChargeOfId }) => {

    const [fetching, setFetching] = useState<boolean>(true)
    const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([])


    const getActivityHistory = async () => {
        setFetching(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/activityLog/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                setActivityHistory(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        if (patientId) getActivityHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    return (
        <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Fecha y hora</th>
                        <th>Actividad</th>
                        <th>Realizada por</th>
                    </tr>
                </thead>
                <tbody>
                    {activityHistory.map((activity) => (
                        <tr key={activity.timestamp}>
                            <td>{new Date(activity.timestamp).toLocaleString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                            })}</td>
                            <td>{activity.activity}</td>
                            <td>{activity.username}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div>
    )
}

export default PatientActivityHistory