import "./PatientDetail.css"
import "../../Global.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import handleError from "../../utils/HandleErrors"
import { axiosWithToken } from "../../utils/axiosInstances"
import type { patient } from "../../types"
import { Spinner, Image, Nav, Dropdown, NavItem, NavLink } from "react-bootstrap"
import noImage from '../../assets/noImage.png'
import { useNavigate } from "react-router-dom"
import PatientPersonalInfo from "../../components/Patient/PatientPersonalInfo/PatientPersonalInfo"
import PatientMedicalQuestionnaire from "../../components/Patient/PatientMedicalQuestionnaire/PatientMedicalQuestionnaire"
import PatientMedicalHistory from "../../components/Patient/PatientMedicalHistory/PatientMedicalHistory"
import PatientDentalEvaluation from "../../components/Patient/PatientDentalEvaluation/PatientDentalEvaluation"
import PatientLabs from "../../components/Patient/PatientLabs/PatientLabs"
import PatientGallery from "../../components/Patient/PatientGallery/PatientGallery"
import PatientDentalPrediction from "../../components/Patient/PatientDentalPrediction/PatientDentalPrediction"
import PatientActivityHistory from "../../components/Patient/PatientActivityHistory/PatientActivityHistory"
import PatientWotkPlan from "../../components/Patient/PatientWorkPlan/PatientWorkPlan"
import PatientSurgicalProtocol from "../../components/Patient/PatientSurgicalProtocol/PatientSurgicalProtocol"
import SurgicalProtocolDetail from "../../components/SurgicalProtocol/SurgicalProtocolDetail/SurgicalProtocolDetail"
import PatientOdontogram from "../../components/Patient/PatientOdontogram/PatientOdontogram"
import AlertModal from "../../components/Modal/AlertModal"
import { useRecoilState } from "recoil"
import { alertModalState, formState, patientTab } from "../../app/store"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PatienDetail = () => {

    const { id, tab } = useParams()
    const navigate = useNavigate()
    const [currentTab, setCurrentTab] = useState(tab)
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [showAlert, setShowAlert] = useRecoilState(alertModalState)
    const [loading, setLoading] = useState<boolean>(false)
    const [patient, setPatient] = useState<patient>({
        id: 0,
        image: "",
        inChargeOf: "",
        inChargeOfId: 0,
        name: "",
        surname: "",
        docType: "",
        doc: 0,
        gender: "",
        birth: "",
        nationality: "",
        civilState: "",
        country: "",
        state: "",
        city: "",
        address: "",
        derivedBy: "",
        phone: 0,
        email: "",
        occupation: "",
        studies: "",
        workAddress: "",
        workingHours: "",
        social: "",
        socialNumber: 0,
        observations: "",
    })
    const [age, setAge] = useState<number>(0)

    const handleTabChange = (tab:string) => {
        if(dirtyForm) {
            setShowAlert(true)
        } else {
            navigate(`/patient/${id}/${tab}`)
        }
    }

    const getPatient = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/patients/getById?patientId=${id}`)
            if (res.data) {
                setPatient(res.data)
            }
            const today = new Date();
            const bornDate = new Date(res.data.birth);

            setAge(today.getFullYear() - bornDate.getFullYear())
            if (today.getMonth() < bornDate.getMonth() ||
                (today.getMonth() === bornDate.getMonth() && today.getDate() < bornDate.getDate())) {
                setAge(age - 1);
            }
        } catch (error: any) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getPatient()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        setCurrentTab(tab)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    return (
        !loading && patient.id ? <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto position-relative'>
            <div className="d-flex flex-column flex-md-row flex-grow-1">
                <div className="w-sm-100 w-lg-25">
                    <Image className="mb-3 w-50 rounded" src={patient.image ? `data:image/jpeg;base64,${patient.image}` : noImage}></Image>
                </div>
                <div className="d-flex flex-column text-start justify-content-between">
                    <p className="fs-6 mb-3 text-light"><b>Nombre: </b>{`${patient.surname} ${patient.name}`}</p>
                    <p className="fs-6 mb-3 text-light"><b>Documento: </b>{`(${patient.docType}) ${patient.doc}`}</p>
                    <p className="fs-6 mb-3 text-light"><b>Edad: </b>{`${age}`}</p>
                    <p className="fs-6 mb-3 text-light"><b>Obra Social: </b>{`${patient.social}`}</p>
                    <hr className="d-flex d-md-none" />
                </div>
                <div className="text-light text-start text-md-end flex-grow-1">
                    <p><b>Profesional a cargo</b></p>
                    <p>{patient.inChargeOf}</p>
                </div>
                <hr className="d-flex d-md-none" />
            </div>
            <div className='bg-dark-700 container rounded'>
                <Nav variant="tabs" defaultActiveKey="PersonalInfo" activeKey={currentTab}>
                    <Dropdown as={NavItem}>
                        <Dropdown.Toggle className="custom-nav" as={NavLink}>Datos del paciente</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="PersonalInfo" onClick={() => handleTabChange("PersonalInfo")}>Datos personales</Dropdown.Item>
                            <Dropdown.Item eventKey="healthQuestionary" onClick={() => handleTabChange("healthQuestionary")}>Cuestionario de salud</Dropdown.Item>
                            <Dropdown.Item eventKey="medicalHistory" onClick={() => handleTabChange("medicalHistory")}>Historia clínica</Dropdown.Item>
                            <Dropdown.Item eventKey="labs" onClick={() => handleTabChange("labs")}>Prácticas complementarias</Dropdown.Item>
                            <Dropdown.Item eventKey="dentalEvaluation" onClick={() => handleTabChange("dentalEvaluation")}>Evaluación dental</Dropdown.Item>
                            <Dropdown.Item eventKey="dentalPrediction" onClick={() => handleTabChange("dentalPrediction")}>Pronóstico por pieza</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Nav.Item>
                        <Nav.Link className="custom-nav" eventKey="activityHistory" onClick={() => handleTabChange("activityHistory")}>Historial</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="custom-nav" eventKey="gallery" onClick={() => handleTabChange("gallery")}>Galería</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="custom-nav" eventKey="workPlan" onClick={() => handleTabChange("workPlan")}>Plan de trabajo</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="custom-nav" eventKey="surgicalProtocol" onClick={() => handleTabChange("surgicalProtocol")}>Protocolo quirúrgico</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="custom-nav" eventKey="odontogram" onClick={() => handleTabChange("odontogram")}>Ficha odontológica</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="mt-3 position-relative">
                    {currentTab === "PersonalInfo" ? <PatientPersonalInfo patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "healthQuestionary" ? <PatientMedicalQuestionnaire patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "medicalHistory" ? <PatientMedicalHistory patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "dentalEvaluation" ? <PatientDentalEvaluation patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "dentalPrediction" ? <PatientDentalPrediction patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "labs" ? <PatientLabs patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "activityHistory" ? <PatientActivityHistory patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "gallery" ? <PatientGallery patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "workPlan" ? <PatientWotkPlan patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "surgicalProtocol" ? <PatientSurgicalProtocol patientId={patient.id} inChargeOfId={patient.inChargeOfId} /> : null}
                    {currentTab === "surgicalProtocolDetail" ? <SurgicalProtocolDetail/> : null}
                    {currentTab === "odontogram" ? <PatientOdontogram/> : null}
                </div>
            </div>
            {showAlert && <AlertModal/>}
        </div> :
            <Spinner />
    )
}

export default PatienDetail