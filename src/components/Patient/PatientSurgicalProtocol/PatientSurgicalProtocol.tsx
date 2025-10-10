import { useEffect, useState } from "react"
import { Accordion, Spinner, Table } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { modalState, userState } from "../../../app/store"
import type { SurgicalProtocol } from "../../../types"
import { axiosWithToken } from "../../../utils/axiosInstances"
import handleError from "../../../utils/HandleErrors"
import CustomModal from "../../Modal/CustomModal"
import CreateSurgicalProtocol from "../../SurgicalProtocol/CreateSurgicalProtocol/CreateSurgicalProtocol"
import { notifyError } from "../../Toaster/Toaster"
import { useNavigate } from "react-router-dom"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientSurgicalProtocolProps {
    patientId: number
    inChargeOfId: number
}

const PatientSurgicalProtocol: React.FC<PatientSurgicalProtocolProps> = ({ patientId, inChargeOfId }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const [show, setShow] = useRecoilState(modalState)
    const [currentAccordion, setCurrentAccordion] = useState<string>("")
    const [modal, setModal] = useState("")
    const [surgicalProtocols, setSurgicalProtocols] = useState<SurgicalProtocol[]>([])
    const navigate = useNavigate()

    const getSurgicalProtocol = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/surgicalProtocol/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                setSurgicalProtocols(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSurgicalProtocol = () => {
        if (inChargeOfId == user.id) {
            setModal("create")
        } else {
            notifyError("Solo el profesional a cargo puede iniciar un protoloco quirúrgico")
        }
    }

    const cancel = () => {
        setModal("")
    }

    useEffect(() => {
        if (patientId) getSurgicalProtocol()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    return (
        !loading ? <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            {!show && <div className="w-100">
                <h6 className="text-light text-start">Nuevo protocolo <svg role="button" onClick={handleSurgicalProtocol} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
                <hr />
            </div>}
            {modal === "create" ?
                <CreateSurgicalProtocol updateList={getSurgicalProtocol} patientId={patientId} cancel={cancel}></CreateSurgicalProtocol>
                :
                <Table striped bordered hover size="sm" variant="dark">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Primer ayudante</th>
                        <th>Segundo ayudante</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {surgicalProtocols.map(surgicalProtocol => <tr key={String(surgicalProtocol.id)}>
                        <td role='button' onClick={() => navigate(`../patient/${patientId}/surgicalProtocolDetail/${surgicalProtocol.id}`)}>{surgicalProtocol.date}</td>
                        <td role='button' onClick={() => navigate(`../patient/${patientId}/surgicalProtocolDetail/${surgicalProtocol.id}`)}>{surgicalProtocol.firstAssistant}</td>
                        <td role='button' onClick={() => navigate(`../patient/${patientId}/surgicalProtocolDetail/${surgicalProtocol.id}`)}>{surgicalProtocol.secondAssistant}</td>
                        <td role='button' onClick={() => navigate(`../patient/${patientId}/surgicalProtocolDetail/${surgicalProtocol.id}`)}>{surgicalProtocol.surgeryType}</td>
                    </tr>
                    )}
                </tbody>
            </Table>
            }
        </div> :
            <Spinner></Spinner>
    )
}

export default PatientSurgicalProtocol