import React, { useState } from "react";


type theme="dark" | "light" ;

interface ContextType {
  theme: theme;
  toggletheme: () => void;
}


const Themecontext=React.createContext<ContextType|undefined>(undefined);

export const ThemeProvider:React.FC<{children:React.ReactNode}>=({children})=>{

    const [theme,setTheme]=useState<theme>("light")

    const toggletheme=()=>{
        setTheme((prev)=>prev==="light"?"dark":"light")
    }

    return(
         <Themecontext.Provider value={{ theme, toggletheme }}>
      {children}
    </Themecontext.Provider>
    )
}

export const useThemeContext=()=>{
    const context=React.useContext(Themecontext);
    if(!context){
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
}

