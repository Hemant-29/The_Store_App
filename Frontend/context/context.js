import { createContext } from 'react'

const colorContext = createContext("white");
const urlContext = createContext("http://localhost:5000");

export { colorContext, urlContext };