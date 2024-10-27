import { createContext } from 'react'

const colorContext = createContext("white");
const urlContext = createContext("https://the-store-app.vercel.app/");

export { colorContext, urlContext };