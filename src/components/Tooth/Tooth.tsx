import "./Tooth.css";
import { Dropdown, DropdownButton, ListGroup } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import type { Odontogram, ToothType } from "../../types";

interface ToothProps<T extends keyof Odontogram> {
    number: number;
    status: ToothType;
}

const Tooth = <T extends keyof Odontogram>({ number, status }: ToothProps<T>) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ V: 0, D: 0 });
    const [selectedPart, setSelectedPart] = useState<keyof ToothType | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // const handleClick = (part: keyof ToothType, event: React.MouseEvent<HTMLDivElement>) => {
    //     event.stopPropagation();
    //     setSelectedPart(part);

    //     const { clientX: x, clientY: y } = event;

    //     const menuWidth = 150;
    //     const menuHeight = 100;

    //     let menuX = x;
    //     let menuY = y;

    //     if (x + menuWidth > window.innerWidth) {
    //         menuX = window.innerWidth - menuWidth - 10;
    //     }

    //     if (y + menuHeight > window.innerHeight) {
    //         menuY = window.innerHeight - menuHeight - 10;
    //     }

    //     setMenuPosition({ V: menuY, D: menuX });
    //     setMenuVisible(true);
    // };

    // const handleOptionSelect = (option: string) => {
    //     if (selectedPart) {
    //         onAction(side, section, number, selectedPart, option);
    //     }
    //     setMenuVisible(false);
    // };

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    //             setMenuVisible(false);
    //         }
    //     };

    //     const handleEscPress = (event: KeyboardEvent) => {
    //         if (event.key === 'Escape') {
    //             setMenuVisible(false);
    //         }
    //     };

    //     document.addEventListener('click', handleClickOutside);
    //     document.addEventListener('keydown', handleEscPress);

    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //         document.removeEventListener('keydown', handleEscPress);
    //     };
    // }, []);

    switch (true) {
        case (number <= 30):
            return (
                <div>
                    <div className="position-relative">
                        <img style={{ height: "80px" }} src={`/images/teeth/${number}.png`} alt="" />
                        <img className={status.O === "Pendiente-Perno" ? "position-absolute start-0" : "d-none"} src="/images/toppendingscrew.png" alt="" />
                        <img className={status.O === "Realizado-Perno" ? "position-absolute start-0" : "d-none"} src="/images/topscrew.png" alt="" />
                        <img className={status.O === "Pendiente-Conducto" ? "position-absolute start-0" : "d-none"} src="/images/toppendingconduct.png" alt="" />
                        <img className={status.O === "Realizado-Conducto" ? "position-absolute start-0" : "d-none"} src="/images/topconduct.png" alt="" />
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute V-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.D.replaceAll(".", "-")}`} />
                            <div className={`top ${status.V.replaceAll(".", "-")}`} />
                            <div className={`right ${status.M.replaceAll(".", "-")}`} />
                            <div className={`bot ${status.L.replaceAll(".", "-")}`} />
                            <div className={`center ${status.O.replaceAll(".", "-")}`} />
                        </div>
                        <p className="text-light">{number}</p>
                    </div>
                </div>
            );

        case (number > 50 && number < 70):
            return (
                <div>
                    <div>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute V-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.D}`} />
                            <div className={`top ${status.V}`} />
                            <div className={`right ${status.M}`} />
                            <div className={`bot ${status.L}`} />
                            <div className={`center ${status.O}`} />
                        </div>
                        <p className="text-light">{number}</p>
                    </div>
                </div>
            );
        case (number > 70 && number < 90):
            return (
                <div>
                    <div>
                        <p className="text-light m-0">{number}</p>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>
                            <img className="position-absolute V-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.D}`} />
                            <div className={`top ${status.V}`} />
                            <div className={`right ${status.M}`} />
                            <div className={`bot ${status.L}`} />
                            <div className={`center ${status.O}`} />
                        </div>
                    </div>
                </div>
            );
        case (number > 30 && number < 50):
            return (
                <div className="mt-3 mb-3 position-relative">
                    <div>
                        <p className="text-light m-0">{number}</p>
                        <div className="tooth bg-light position-relative" onClick={(e) => e.stopPropagation()}>

                            <img className="position-absolute V-0 start-0" src="/images/teeth.png" alt="" />
                            <div className={`left ${status.D}`} />
                            <div className={`top ${status.V}`} />
                            <div className={`right ${status.M}`} />
                            <div className={`bot ${status.L}`} />
                            <div className={`center ${status.O}`} />

                            {/* {menuVisible && (
                                <div ref={menuRef} className="context-menu" style={{ V: menuPosition.V, D: menuPosition.D }}>
                                    <ListGroup>
                                        <ListGroup.Item action onClick={() => handleOptionSelect("bg-danger")}>
                                            Realizado
                                        </ListGroup.Item>
                                        <ListGroup.Item action onClick={() => handleOptionSelect("bg-primary")}>
                                            Pendiente
                                        </ListGroup.Item>
                                        {selectedPart === "O" && <ListGroup.Item >
                                            <DropdownButton
                                                key="end"
                                                id={`dropdown-button-drop-end`}
                                                drop="end"
                                                variant="none"
                                                title={`Extracción`}
                                            >
                                                <Dropdown.Item eventKey="1" onClick={() => handleOptionSelect("extraction")}>Realizada</Dropdown.Item>
                                                <Dropdown.Item eventKey="2" onClick={() => handleOptionSelect("pendingExtraction")}>Pendiente</Dropdown.Item>
                                            </DropdownButton>
                                        </ListGroup.Item>}

                                        {selectedPart === "O" && <ListGroup.Item >
                                            <DropdownButton
                                                key="end"
                                                id={`dropdown-button-drop-end`}
                                                drop="end"
                                                variant="none"
                                                title={`Corona`}
                                            >
                                                <Dropdown.Item eventKey="1" onClick={() => handleOptionSelect("crown")}>Realizada</Dropdown.Item>
                                                <Dropdown.Item eventKey="2" onClick={() => handleOptionSelect("pendingCrown")}>Pendiente</Dropdown.Item>
                                            </DropdownButton>
                                        </ListGroup.Item>}
                                        <ListGroup.Item action onClick={() => handleOptionSelect("clean")}>
                                            Borrar
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            )} */}
                        </div>
                    </div>
                    <img style={{ height: "80px" }} src={`/images/teeth/${number}.png`} alt="" />
                    <img className={status.O === "Pendiente-Perno" ? "position-absolute start-0" : "d-none"} src="/images/botpendingscrew.png" alt="" />
                    <img className={status.O === "Realizado-Perno" ? "position-absolute start-0" : "d-none"} src="/images/botscrew.png" alt="" />
                    <img className={status.O === "Pendiente-Conducto" ? "position-absolute start-0" : "d-none"} src="/images/botpendingconduct.png" alt="" />
                    <img className={status.O === "Realizado-Conducto" ? "position-absolute start-0" : "d-none"} src="/images/botconduct.png" alt="" />
                </div>
            );
    }


}

export default Tooth;