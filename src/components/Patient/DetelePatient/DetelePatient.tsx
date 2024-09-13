import { notifySuccess } from "../../Toaster/Toaster";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { modalState } from "../../../app/store"
import { useRecoilState } from "recoil"
import Button from 'react-bootstrap/Button';
import handleError from "../../../utils/HandleErrors";
import { Spinner } from "react-bootstrap";
import { useState } from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface DeletePatientProps {
    patientId: number
    patientName: string
    updateList: () => void;
}

const DeletePatient: React.FC<DeletePatientProps> = ({ patientId, patientName, updateList }) => {
    const [loading, setloading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const handleDelete = async () => {
        setloading(true)
        try {
            const res = await axiosWithToken.delete(`${SERVER_URL}/api/patients/deleteById?id=${patientId}`)
            if (res.data) {
                notifySuccess(res.data)
                updateList()
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
            <span>¿Esta seguro que quiere eliminar el paciente {patientName}?</span>
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

export default DeletePatient