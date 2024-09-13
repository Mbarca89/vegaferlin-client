import { useRecoilState } from "recoil"
import { modalState } from "../../../app/store"
import type { Compensator } from "../../../types"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useFormik } from "formik"
import { useState } from "react"

interface EditCompensatorProps {
    compensators: Compensator[]
    index: number
}


const EditCompensator:React.FC<EditCompensatorProps> = ({compensators, index}) => {

    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)

    const validate = (values: Compensator): Compensator => {
        const errors: any = {};

        if (!values.location) {
            errors.location = 'Ingrese la ubicación';
        }
        if (!values.localization) {
            errors.localization = 'Ingrese la ubicación';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            location: compensators[index].location,
            localization: compensators[index].localization
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            compensators[index] = values
            setShow(false)
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
                        <Form.Label >Ubicación</Form.Label>
                        <Form.Control type="number"
                            id="location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.location && formik.errors.location)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.location}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Localización</Form.Label>
                        <Form.Control type="text" placeholder="Localización"
                            id="localization"
                            name="localization"
                            value={formik.values.localization}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.localization && formik.errors.localization)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.localization}</Form.Control.Feedback>
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
                                    Guardar
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

export default EditCompensator