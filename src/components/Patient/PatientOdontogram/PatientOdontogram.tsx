import { useState } from "react"
import { Nav } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { alertModalState, formState } from "../../../app/store"
import ActualOdontogram from "../../Odontogram/ActualOdontogram.tsx/ActualOdontogram"
import AlertModal from "../../Modal/AlertModal"

interface PatientOdondogramProps {
    patientId: number
}

const PatientOdontogram:React.FC<PatientOdondogramProps> = ({patientId}) => {

    const setTab = () => {
        setCurrentTab("patients")
    }

    const [currentTab, setCurrentTab] = useState("actual")
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
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-700 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="actual" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="actual" onClick={() => handleTabChange("actual")}>Odontograma actual</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="versions" onClick={() => handleTabChange("versions")}>Versiones anteriores</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "actual" ? <ActualOdontogram patientId={patientId} /> : null}
                {/* {currentTab === "versions" ? <CreatePatient updateList={setTab} /> : null} */}
            </div>
            {showAlert && <AlertModal/>}
        </div>
    )
   
}

export default PatientOdontogram