import { useEffect, useState } from "react"
import { Accordion, Button, Spinner } from "react-bootstrap"
import { notifyError } from "../../Toaster/Toaster"
import { useRecoilState } from "recoil"
import { userState, modalState } from "../../../app/store"
import CustomModal from "../../Modal/CustomModal"
import CreateWorkPlan from "../../WorkPlan/CreateWorkPlan/CreateWorkPlan"
import CloseWorkPlan from "../../WorkPlan/CloseWorkPlan/CloseWorkPlan"
import AddStage from "../../WorkPlan/AddStage/AddStage"
import EditStage from "../../WorkPlan/EditStage/EditStage"
import { axiosWithToken } from "../../../utils/axiosInstances"
import type { WorkPlan } from "../../../types"
import handleError from "../../../utils/HandleErrors"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface PatientWorkPlanProps {
    patientId: number
    inChargeOfId: number
}

const PatientWotkPlan: React.FC<PatientWorkPlanProps> = ({ patientId, inChargeOfId }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const [show, setShow] = useRecoilState(modalState)
    const [currentAccordion, setCurrentAccordion] = useState<string>("")
    const [modal, setModal] = useState("")
    const [currentWorkPlan, setCurrentWorkPlan] = useState<number>(0)
    const [currentStages, setCurrentStages] = useState<string[]>([])
    const [stageIndex, setStageIndex] = useState<number>(0)
    const [workPlans, setWotkPlans] = useState<WorkPlan[]>([])

    const handleWorkPlan = () => {
        if (inChargeOfId == user.id) {
            setModal("create")
            setShow(true)
        } else {
            notifyError("Solo el profesional a cargo puede iniciar un plan de trabajo")
        }
    }

    const handleWorkPlanStage = (id: number) => {
        if (inChargeOfId == user.id) {
            setCurrentWorkPlan(id)
            setModal("addStage")
            setShow(true)
        } else {
            notifyError("Solo el profesional a cargo puede editar un plan de trabajo")
        }
    }

    const handleCloseWorkPlan = (id: number) => {
        if (inChargeOfId == user.id) {
            setCurrentWorkPlan(id)
            setModal("close")
            setShow(true)
        } else {
            notifyError("Solo el profesional a cargo puede cerrar un plan de trabajo")
        }
    }

    const getWorkPlan = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/workPlan/getByPatientId?patientId=${patientId}`)
            if (res.data) {
                setWotkPlans(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (stages: string[], index:number) => {
        if (inChargeOfId == user.id) {
            setCurrentStages(stages)
            setStageIndex(index)
            setModal("editStage")
            setShow(true)
        } else {
            notifyError("Solo el profesional a cargo puede editar un plan de trabajo")
        }
    }

    useEffect(() => {
        if (patientId) getWorkPlan()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId])

    return (
        !loading ? <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            <div className="w-100 mb-3">
                <h6 className="text-light text-start">Nuevo plan <svg role="button" onClick={handleWorkPlan} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
                <hr />
                <Accordion defaultActiveKey={currentAccordion} data-bs-theme="dark" onSelect={(eventKey) => setCurrentAccordion(eventKey?.toString() || "")}>
                    {workPlans.map((workPlan: WorkPlan, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>{`${workPlan.observations}\t `}{workPlan.status !== "En proceso" && <svg width="20" height="20" viewBox="0 0 512 512" style={{ color: "#7CC504" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 16 16" fill="#7CC504" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#7CC504"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.75 8.75l3.5 3.5l7-7.5" /></g></svg></svg>}</Accordion.Header>
                            <Accordion.Body>
                                <div className="text-start">
                                    <p><b>Fecha de inicio: </b>{new Date(workPlan.startDate).toLocaleDateString()}</p>
                                    <p><b>Estado: </b>{workPlan.status}</p>
                                    {workPlan.status !== "En proceso" && <p><b>Fecha de finalización: </b>{new Date(workPlan.endDate).toLocaleDateString()}</p>}
                                    <hr />
                                </div>
                                {workPlan.status === "En proceso" && <h6 className="text-light text-start">Nueva etapa <svg role="button" onClick={() => handleWorkPlanStage(workPlan.id)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>}
                                {workPlan.stages ?
                                    <div className="text-start">
                                        {workPlan.stages?.map((stage, index) => (
                                            <div className="border rounded p-1">
                                                <div className="d-flex flex-row justify-content-between">
                                                    <p>{`Etapa ${index + 1}`}</p>
                                                    <svg onClick={() => handleEdit(workPlan.stages, index)} role="button" width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full cursor-pointer"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#D040EE" x="0" y="0" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#D040EE"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg>
                                                </div>
                                                <ul>
                                                    <li>
                                                        <p>{stage}</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    :
                                    <h6>Aún no hay etapas</h6>
                                }
                                {workPlan.status === "En proceso" && <hr />}
                                {workPlan.status === "En proceso" && <Button onClick={() => handleCloseWorkPlan(workPlan.id)}>Cerrar plan de trabajo</Button>}
                            </Accordion.Body>
                        </Accordion.Item>

                    ))}
                </Accordion>
            </div>
            {show && modal === "create" &&
                <CustomModal title="Nuevo plan de trabajo">
                    <CreateWorkPlan updateList={getWorkPlan} patientId={patientId}></CreateWorkPlan>
                </CustomModal>}
            {show && modal === "addStage" &&
                <CustomModal title="Nueva etapa">
                    <AddStage updateList={getWorkPlan} patientId={patientId} workPlanId={currentWorkPlan}></AddStage>
                </CustomModal>}
            {show && modal === "close" &&
                <CustomModal title="Cerrar plan de trabajo">
                    <CloseWorkPlan updateList={getWorkPlan} patientId={patientId} workPlanId={currentWorkPlan}></CloseWorkPlan>
                </CustomModal>}
                {show && modal === "editStage" &&
                <CustomModal title="Nueva etapa">
                    <EditStage updateList={getWorkPlan} patientId={patientId} workPlanId={currentWorkPlan} stages={currentStages} stageIndex={stageIndex}></EditStage>
                </CustomModal>}
        </div> :
            <Spinner></Spinner>
    )
}

export default PatientWotkPlan