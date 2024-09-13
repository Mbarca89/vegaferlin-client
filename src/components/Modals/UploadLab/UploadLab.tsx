import { useRef, useState } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import { useRecoilState } from "recoil"
import { modalState } from "../../../app/store"
import { axiosWithToken } from "../../../utils/axiosInstances"
import { notifyError, notifySuccess } from "../../Toaster/Toaster"
import handleError from "../../../utils/HandleErrors"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface UploadLabProps {
    labId: number;
    labType: string;
    updateList: () => void;
    patientId: number
}

const UploadLab: React.FC<UploadLabProps> = ({ labId, labType, updateList, patientId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [show, setShow] = useRecoilState(modalState);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!file) {
            notifyError('No se ha seleccionado ningún archivo');
            return;
        }

        setLoading(true);
        const uploadLab = new FormData();
        uploadLab.append('labId', labId.toString());
        uploadLab.append('labType', labType);
        uploadLab.append('files', file);
        uploadLab.append("patientId", patientId.toString())
        try {
            const res = await axiosWithToken.post(`${SERVER_URL}/api/labs/upload`, uploadLab, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data) {
                notifySuccess(res.data);
                updateList();
                setShow(false);
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
            setShow(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleCancel = () => {
        setShow(false);
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <span>Cargar archivo para {labType}</span>
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label className="text-light">Seleccionar archivo</Form.Label>
                        <Form.Control
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            ref={inputRef}
                        />
                    </Form.Group>
                </Form>
            </div>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-4 w-100">
                {!loading ? (
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Button className="" variant="danger" onClick={handleCancel}>Cancelar</Button>
                    </div>
                ) : (
                    <div className="w-25 d-flex align-items-center justify-content-center">
                        <Spinner />
                    </div>
                )}
                <div className="w-25 d-flex align-items-center justify-content-center">
                    <Button className="" variant="primary" onClick={handleUpload}>Subir</Button>
                </div>
            </div>
        </div>
    );
};

export default UploadLab;