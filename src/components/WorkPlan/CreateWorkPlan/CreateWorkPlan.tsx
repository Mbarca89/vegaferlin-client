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

interface CreateWorkPlanProps {
    patientId: number
    updateList: () => void
}

const CreateWorkPlan: React.FC<CreateWorkPlanProps> = ({ patientId, updateList }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)

    const validate = (values: WorkPlan): WorkPlan => {
        const errors: any = {};

        if (!values.startDate) {
            errors.startDate = 'Ingrese la fecha de inicio';
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
            const createWorkPlan = {
                patientId: patientId,
                startDate: values.startDate,
                observations: values.observations,
                status: "En proceso"
            }
            let res
            try {
                res = await axiosWithToken.post(`${SERVER_URL}/api/workPlan/create`, createWorkPlan)
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
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Fecha de inicio</Form.Label>
                        <Form.Control type="date"
                            id="startDate"
                            name="startDate"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.startDate && formik.errors.startDate)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.startDate}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Título</Form.Label>
                        <Form.Control type="text" placeholder="Título"
                            as="textarea"
                            id="observations"
                            name="observations"
                            value={formik.values.observations}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.observations && formik.errors.observations)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.observations}</Form.Control.Feedback>
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
                                    Crear
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

export default CreateWorkPlan