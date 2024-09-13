import { useRecoilState } from "recoil"
import { modalState } from "../../../app/store"
import type { Implant } from "../../../types"
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useFormik } from "formik"
import { useState } from "react"

interface EditImplantProps {
    implants: Implant[]
    index: number
}

const EditImplant: React.FC<EditImplantProps> = ({ implants, index }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [loading, setLoading] = useState<boolean>(false)

    const validate = (values: Implant): Implant => {
        const errors: any = {};

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            location: implants[index].location,
            brand: implants[index].brand,
            connection: implants[index].connection,
            platform: implants[index].platform,
            length: implants[index].length,
            diameter: implants[index].diameter,
            torque: implants[index].torque,
            stability: implants[index].stability,
            placement: implants[index].placement,
            instrumentalMethod: implants[index].instrumentalMethod,
        },
        validate,
        enableReinitialize: true,
        onSubmit: async values => {
            implants[index] = values
            setShow(false)
        },
    });

    const resetForm = () => {
        formik.resetForm();
        setShow(false)
    }

    return (
        <div className="text-light">
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
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Marca y modelo</Form.Label>
                        <Form.Control type="text"
                            id="brand"
                            name="brand"
                            value={formik.values.brand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.brand && formik.errors.brand)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.brand}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Conexión</Form.Label>
                        <Form.Control type="text"
                            id="connection"
                            name="connection"
                            value={formik.values.connection}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.connection && formik.errors.connection)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.connection}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Plataforma</Form.Label>
                        <Form.Control type="text"
                            id="platform"
                            name="platform"
                            value={formik.values.platform}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.platform && formik.errors.platform)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.platform}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Longitud</Form.Label>
                        <Form.Control type="number"
                            id="length"
                            name="length"
                            value={formik.values.length}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.length && formik.errors.length)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.length}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Diámetro del implante</Form.Label>
                        <Form.Control type="number"
                            id="diameter"
                            name="diameter"
                            value={formik.values.diameter}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.diameter && formik.errors.diameter)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.diameter}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group className='text-light' as={Col} xs={12} lg={12}>
                        <Form.Label >Torque de inserción</Form.Label>
                        <Form.Control type="number"
                            id="torque"
                            name="torque"
                            value={formik.values.torque}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.torque && formik.errors.torque)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.torque}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Estabilidad iniciál</Form.Label>
                        <Form.Select
                            id="stability"
                            name="stability"
                            value={formik.values.stability ? "true" : "false"}
                            onChange={e => formik.setFieldValue("stability", e.target.value === 'true')}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.stability && formik.errors.stability)}
                        >
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Oportunidad de colocación</Form.Label>
                        <Form.Select
                            id="placement"
                            name="placement"
                            value={formik.values.placement}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.placement && formik.errors.placement)}
                        >
                            <option value="Tipo 1">Tipo 1</option>
                            <option value="Tipo 2">Tipo 2</option>
                            <option value="Tipo 3">Tipo 3</option>
                            <option value="Tipo 4">Tipo 4</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} xs={12} lg={12}>
                        <Form.Label className='text-light'>Método de inserción</Form.Label>
                        <Form.Select
                            id="instrumentalMethod"
                            name="instrumentalMethod"
                            value={formik.values.instrumentalMethod}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.instrumentalMethod && formik.errors.instrumentalMethod)}
                        >
                            <option value="Manual">Manual</option>
                            <option value="Mecánico">Mecánico</option>
                            <option value="Ambos">Ambos</option>
                        </Form.Select>
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
        </div >
    )
}

export default EditImplant