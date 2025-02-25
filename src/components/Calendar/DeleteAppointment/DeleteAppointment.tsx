import { useState } from "react"
import { useRecoilState } from "recoil"
import { modalState } from "../../../app/store"
import { axiosWithToken } from "../../../utils/axiosInstances"
import { notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { Button, Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeletePatientProps {
    id: number,
    updateEvents: () => void
}

const DeleteAppointment:React.FC<DeletePatientProps> = ({id, updateEvents}) => {

    const [loading, setloading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/appointment/deleteById?id=${id}`)
            if (res.data) {
                notifySuccess(res.data)
                updateEvents()
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setShow(false)
            setloading(false)
        }
    }

    const handleCancel = () => {
        setShow(false)
    }

    return (
        <div className="d-flex flex-column align-items-center text-light">
            <span>¿Esta seguro que quiere eliminar la cita?</span>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                {!loading ?
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="danger" onClick={handleDelete}>Si</Button>
                    </div>
                    :
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                }
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="primary" onClick={handleCancel}>No</Button>
                </div>
            </div>
        </div>
    )
}

export default DeleteAppointment