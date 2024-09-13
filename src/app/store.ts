import { atom } from "recoil";

const userState = atom({
  key: "userState",
  default: {
    id: 0,
    name: "",
    surname: "",
    userName: "",
    role: "user"
  }
})

const logState = atom({
  key: "logState",
  default: false
})

const modalState = atom({
  key: "modalState",
  default: false
})

const alertModalState = atom({
  key: "alertModalState",
  default: false
})

const formState = atom({
  key: "formState",
  default: false
})

const loadingState = atom({
  key: 'loadingState',
  default: false,
})

const patientTab = atom({
  key: 'patientTab',
  default: 'PersonalInfo'
})

export { userState, logState, modalState, alertModalState, loadingState, formState, patientTab }