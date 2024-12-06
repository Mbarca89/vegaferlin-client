import { Form, Table } from "react-bootstrap"
import handleError from "../../../utils/HandleErrors";
import { useEffect, useState } from "react";
import type { Odontogram, OdontogramVersion, ToothType } from "../../../types";
import { axiosWithToken } from "../../../utils/axiosInstances";
import OdontogramChart from "../Odontogram";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface OdontogramVersionsProps {
    patientId: number
}

const OdontogramVersions: React.FC<OdontogramVersionsProps> = ({ patientId }) => {

    function createEmptyTooth(): ToothType {
        return {
            D: "",
            V: "",
            M: "",
            L: "",
            O: "",
        };
    }

    const [odontogramVersions, setOdontogramVersions] = useState<OdontogramVersion[]>([])
    const [currentOdondogram, setCurrentOdontogram] = useState<Odontogram>({
        teeth: new Map([
            [18, createEmptyTooth()],
            [17, createEmptyTooth()],
            [16, createEmptyTooth()],
            [15, createEmptyTooth()],
            [14, createEmptyTooth()],
            [13, createEmptyTooth()],
            [12, createEmptyTooth()],
            [11, createEmptyTooth()],
            [55, createEmptyTooth()],
            [54, createEmptyTooth()],
            [53, createEmptyTooth()],
            [52, createEmptyTooth()],
            [51, createEmptyTooth()],
            [48, createEmptyTooth()],
            [47, createEmptyTooth()],
            [46, createEmptyTooth()],
            [45, createEmptyTooth()],
            [44, createEmptyTooth()],
            [43, createEmptyTooth()],
            [42, createEmptyTooth()],
            [41, createEmptyTooth()],
            [85, createEmptyTooth()],
            [84, createEmptyTooth()],
            [83, createEmptyTooth()],
            [82, createEmptyTooth()],
            [81, createEmptyTooth()],
            [21, createEmptyTooth()],
            [22, createEmptyTooth()],
            [23, createEmptyTooth()],
            [24, createEmptyTooth()],
            [25, createEmptyTooth()],
            [26, createEmptyTooth()],
            [27, createEmptyTooth()],
            [28, createEmptyTooth()],
            [61, createEmptyTooth()],
            [62, createEmptyTooth()],
            [63, createEmptyTooth()],
            [64, createEmptyTooth()],
            [65, createEmptyTooth()],
            [31, createEmptyTooth()],
            [32, createEmptyTooth()],
            [33, createEmptyTooth()],
            [34, createEmptyTooth()],
            [35, createEmptyTooth()],
            [36, createEmptyTooth()],
            [37, createEmptyTooth()],
            [38, createEmptyTooth()],
            [71, createEmptyTooth()],
            [72, createEmptyTooth()],
            [73, createEmptyTooth()],
            [74, createEmptyTooth()],
            [75, createEmptyTooth()],
        ]),
        treatments: [],
        odontogramDate: ""
    })

    const getOdontogramVersions = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/odontogram/getOdontograms?patientId=${patientId}`)
            if (res.data) {
                setOdontogramVersions(res.data)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const getSelectedVersion = async (version: number) => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/odontogram/getById?id=${version}`)
            if (res.data) {
                const parsedTeeth = JSON.parse(res.data.odontogramJson);

                const teethMap = new Map<number, ToothType>(
                    Object.entries(parsedTeeth).map(([key, value]) => [Number(key), value as ToothType])
                );

                setCurrentOdontogram({
                    teeth: teethMap,
                    treatments: res.data.treatments,
                    odontogramDate: res.data.odontogramDate
                })
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleVersionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        getSelectedVersion(parseInt(event.target.value))
    }

    useEffect(() => {
        if (patientId) getOdontogramVersions()
    }, [])

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label className="text-light">Seleccionar fecha</Form.Label>
                    <Form.Select
                        id="brushFrequency"
                        name="brushFrequency"
                        onChange={handleVersionSelect}
                    >
                        {odontogramVersions.map((version, index) => (
                            <option className="text-dark" key={index} value={version.id}>{version.odontogramDate?.split("T")[0]}</option>

                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>
            <hr />
            <OdontogramChart odontogram={currentOdondogram}></OdontogramChart>
            <hr className="mb-5" />
            <div className="mb-3">
                <Table variant="dark" className="mb-3">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th className=''>Descripción</th>
                            <th>Pieza</th>
                            <th>Caras</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOdondogram.treatments.map((treatment, index) => <tr key={index}>
                            <td>{treatment.code}</td>
                            <td>{treatment.description}</td>
                            <td>{treatment.piece}</td>
                            <td>{treatment.faces.toUpperCase()}</td>
                            <td>{treatment.status}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default OdontogramVersions