import { Col, Row } from "react-bootstrap"

interface RenderGalleryProps {
    gallery: string[]
    studyName: string
    handleUpload: (studyName: string) => void
    handleOpenGallery: (studyName: string, index: number) => void
}

const RenderGallery: React.FC<RenderGalleryProps> = ({gallery, studyName, handleUpload, handleOpenGallery}) => {
    
    return (
        <div className="w-100">
            <h6 className="text-light">{studyName.replace("-", " ")} <svg role="button" onClick={() => handleUpload(studyName)} width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" strokeWidth="0" strokeOpacity="100%" paintOrder="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 24 24" fill="#632f6b" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#632f6b"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 20v-8m0 0V4m0 8h8m-8 0H4" /></g></svg></svg></h6>
            <div className="d-flex flex-column align-items-start">
                <Row className="w-100">
                    {gallery?.map((thumb, index) => (
                        <Col lg={2} key={index}>
                            <img role="button" onClick={() => handleOpenGallery(studyName, index)} className="w-100" key={thumb} src={thumb} alt="" />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    )
}

export default RenderGallery