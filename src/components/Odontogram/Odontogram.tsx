import type { Odontogram, Quadrant, ToothType } from "../../types";
import Tooth from "../Tooth/Tooth";

interface OdontogramChartProps {
    odontogram: Odontogram
    handleAction: <T extends keyof Quadrant>(
        side: keyof Odontogram,
        section: T,
        toothNumber: number,
        selectedPart: keyof ToothType,
        action: string
    ) => void
}

const OdontogramChart:React.FC<OdontogramChartProps> = ({odontogram, handleAction})  => {
    return (
        <div className="d-flex flex-row justify-content-around">
            <div className="d-flex flex-column align-items-end">
                <div className="d-flex flex-row gap-1">
                    {Array.from(odontogram.left.top1.entries()).map(([key, value], index) => (
                        <Tooth side={"left"} section="top1" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(odontogram.left.top2.entries()).map(([key, value], index) => (
                        <Tooth side={"left"} section="top2" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="d-flex flex-row gap-1">
                        {Array.from(odontogram.left.bottom2.entries()).map(([key, value], index) => (
                            <Tooth side={"left"} section="bottom2" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                        ))}
                    </div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(odontogram.left.bottom1.entries()).map(([key, value], index) => (
                            <Tooth side={"left"} section="bottom1" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(odontogram.right.top1.entries()).map(([key, value], index) => (
                        <Tooth side={"right"} section="top1" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                    ))}
                </div>
                <div className="d-flex flex-row gap-1">
                    {Array.from(odontogram.right.top2.entries()).map(([key, value], index) => (
                        <Tooth side={"right"} section="top2" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                    ))}
                </div>
                <div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(odontogram.right.bottom2.entries()).map(([key, value], index) => (
                            <Tooth side={"right"} section="bottom2" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                        ))}
                    </div>
                    <div className="d-flex flex-row gap-1">
                        {Array.from(odontogram.right.bottom1.entries()).map(([key, value], index) => (
                            <Tooth side={"right"} section="bottom1" number={key} status={value} onAction={handleAction} key={index}></Tooth>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OdontogramChart