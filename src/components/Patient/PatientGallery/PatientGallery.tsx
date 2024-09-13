import { Form, Spinner } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { modalState, userState } from "../../../app/store"
import { axiosWithToken } from "../../../utils/axiosInstances"
import { notifyError } from "../../Toaster/Toaster"
import { useEffect, useState } from "react"
import handleError from "../../../utils/HandleErrors"
import type { gallery } from "../../../types"
import CustomModal from "../../Modal/CustomModal"
import SingleGallery from "../../Modals/Gallery/Gallery"
import UploadImage from "../../Modals/UploadImage/UploadImage"
import RenderGallery from "../../../utils/RenderGallery"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface patientGalleryProps {
    patientId: number
    inChargeOfId: number,
}

const PatientGallery: React.FC<patientGalleryProps> = ({ patientId, inChargeOfId }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState("gallery")
    const [user, setUser] = useRecoilState(userState)
    const [currentGallery, setCurrentGallery] = useState("Extraorales")
    const [currentStudy, setCurrentStudy] = useState("")
    const [openGallery, setOpenGallery] = useState("")
    const [galleryIndex, setGalleryIndex] = useState(0)
    const [gallery, setGallery] = useState<gallery>({
        extraoralFront_thumb: [],
        extraoralMax_thumb: [],
        extraoralLeft_thumb: [],
        extraoralRight_thumb: [],
        intraoralFront_thumb: [],
        intraoralBlackBackground_thumb: [],
        intraoralLeft_thumb: [],
        intraoralRight_thumb: [],
        arcTop_thumb: [],
        arcBottom_thumb: [],
        oclusal_thumb: [],
        vestibular_thumb: [],
        panoramic_thumb: [],
        xray_thumb: [],
    })

    const getThumbnails = async (study: string) => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/gallery/thumbs?patientId=${patientId}&study=${study}`)
            if (res.data) {
                setGallery(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleStudyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentGallery(event.target.value)
        getThumbnails(event.target.value)
    }

    const handleUpload = (study: string) => {
        if (inChargeOfId == user.id) {
            setCurrentStudy(study)
            setModal("upload")
            setShow(true)
        } else {
            notifyError("Solo el profesional a cargo puede cargar imágenes")
        }
    };

    const handleOpenGallery = (study: string, index: number) => {
        setOpenGallery(study)
        setGalleryIndex(index)
        setModal("gallery")
        setShow(true)
    }

    useEffect(() => {
        getThumbnails("Extraorales")
    }, [])

    return (
        <div className="d-flex flex-column align-items-center text-light">
            <Form.Group>
                <Form.Label className="text-light">Seleccionar galería</Form.Label>
                <Form.Select
                    id="brushFrequency"
                    name="brushFrequency"
                    value={currentGallery}
                    onChange={handleStudyChange}
                >
                    <option value="Extraorales">Extraorales</option>
                    <option value="Intraorales">Intraorales</option>
                    <option value="Arco dentario">Arco dentario</option>
                    <option value="Zona a tratar">Zona a tratar</option>
                    <option value="Digitalización">Digitalización</option>
                </Form.Select>
            </Form.Group>
            <hr className="w-100" />
            {!loading ?
                <div className="w-100">
                    {currentGallery === "Extraorales" && <div className="d-flex flex-column text-start justify-content-start align-content-start w-100">
                        <RenderGallery gallery={gallery.extraoralFront_thumb} studyName="Extraoral-frente" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.extraoralLeft_thumb} studyName="Extraoral-izquierdo" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.extraoralRight_thumb} studyName="Extraoral-derecho" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.extraoralMax_thumb} studyName="Extraoral-sonrisa-máxima" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                    </div>}
                    {currentGallery === "Intraorales" && <div className="d-flex flex-column text-start justify-content-start align-content-start w-100">
                        <RenderGallery gallery={gallery.intraoralFront_thumb} studyName="Intraoral-frente" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.intraoralBlackBackground_thumb} studyName="Intraoral-fondo-negro" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.intraoralLeft_thumb} studyName="Intraoral-izquierdo" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.intraoralRight_thumb} studyName="Intraoral-derecho" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                    </div>}
                    {currentGallery === "Arco dentario" && <div className="d-flex flex-column text-start justify-content-start align-content-start w-100">
                        <RenderGallery gallery={gallery.arcTop_thumb} studyName="Arco-dentario-superior" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.arcBottom_thumb} studyName="Arco-dentario-inferior" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                    </div>}
                    {currentGallery === "Zona a tratar" && <div className="d-flex flex-column text-start justify-content-start align-content-start w-100">
                        <RenderGallery gallery={gallery.oclusal_thumb} studyName="Zona-a-tratar-oclusal" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.vestibular_thumb} studyName="Zona-a-tratar-vestibular" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                    </div>}
                    {currentGallery === "Digitalización" && <div className="d-flex flex-column text-start justify-content-start align-content-start w-100">
                        <RenderGallery gallery={gallery.panoramic_thumb} studyName="Digitalización-panorámica" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                        <RenderGallery gallery={gallery.xray_thumb} studyName="Digitalización-radiografías" handleOpenGallery={handleOpenGallery} handleUpload={handleUpload}></RenderGallery>
                        <hr />
                    </div>}
                </div>
                :
                <Spinner></Spinner>
            }
            {show && modal === "gallery" &&
                <CustomModal title={openGallery.replaceAll("-", " ")}>
                    <SingleGallery study={openGallery} index={galleryIndex} patientId={patientId}></SingleGallery>
                </CustomModal>}
            {show && modal === "upload" &&
                <CustomModal title={currentStudy.replaceAll("-", " ")}>
                    <UploadImage patientId={patientId} currentGallery={currentGallery} currentStudy={currentStudy} updateGallery={getThumbnails}></UploadImage>
                </CustomModal>}
        </div>
    )
}

export default PatientGallery