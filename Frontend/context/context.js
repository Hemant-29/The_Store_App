import { createContext } from 'react'

const colorContext = createContext("white");
const urlContext = createContext("https://the-store-app.vercel.app/");
// const urlContext = createContext("https://localhost:5000/");
const widthContext = createContext(0);

export { colorContext, urlContext, widthContext };