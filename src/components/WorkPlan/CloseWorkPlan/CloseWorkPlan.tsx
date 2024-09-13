import { useState } from "react";
import type { WorkPlan } from "../../../types";
import { notifySuccess } from "../../Toaster/Toaster";
import handleError from "../../../utils/HandleErrors";
import { axiosWithToken } from "../../../utils/axiosInstances";
import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { modalState } from "../../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CloseWorkPlanProps {
    patientId: number
    workPlanId: number
    updateList: () => void
}

const CloseWorkPlan: React.FC<CloseWorkPlanProps> = ({ patientId, workPlanId, updateList }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: WorkPlan): WorkPlan => {
        const errors: any = {};

        if (!values.status) {
            errors.status = 'Ingrese el motivo de finalización';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: 0,
            startDate: "",
            endDate: "",
            status: "",
            observations: "",
            stages: []
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const closeWorkPlan = {
                patientId: patientId,
                status: values.status
            }
            let res
            try {
                res = await axiosWithToken.put(`${SERVER_URL}/api/workPlan/closeWorkPlan?id=${workPlanId}`, closeWorkPlan)
                notifySuccess(res.data)
                updateList()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
                setShow(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Motivo</Form.Label>
                        <Form.Select
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.status && formik.errors.status)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Terminado">Terminado</option>
                            <option value="Cancelado">Cancelado</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.status}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={resetForm}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Cerrar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default CloseWorkPlan