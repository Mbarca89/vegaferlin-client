import { useState } from "react"
import { Nav } from "react-bootstrap"
import CreatePatient from "../../components/Patient/CreatePatient/CreatePatient"
import PatientList from "../../components/Patient/PatientList/PatientList"
import { useRecoilState } from "recoil"
import { alertModalState, formState } from "../../app/store"
import AlertModal from "../../components/Modal/AlertModal"

const Patients = () => {
    const setTab = () => {
        setCurrentTab("patients")
    }

    const [currentTab, setCurrentTab] = useState("patients")
    const [dirtyForm, setDirtyForm] = useRecoilState(formState)
    const [showAlert, setShowAlert] = useRecoilState(alertModalState)
    
    const handleTabChange = (tab:string) => {
        if(dirtyForm) {
            setShowAlert(true)
        } else {
            setCurrentTab(tab)
        }
    }

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="patients" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="patients" onClick={() => handleTabChange("patients")}>Pacientes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="newPatient" onClick={() => handleTabChange("newPatient")}>Alta paciente</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "patients" ? <PatientList /> : null}
                {currentTab === "newPatient" ? <CreatePatient updateList={setTab} /> : null}
            </div>
            {showAlert && <AlertModal/>}
        </div>
    )
}

export default Patients