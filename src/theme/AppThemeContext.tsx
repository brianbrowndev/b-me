import React, { useReducer } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, Theme } from '@material-ui/core/styles';



const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff",
      // light: "#fafafa",
      light: "#f4f5f7",
    },
    secondary: {
      main: '#2962FF',
    },
    type:'light'
  },
});

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121",
      // light: "#fafafa",
      light: "#333333",
    },
    secondary: {
      main: '#1Eb980',
      // main: '#045D56',
      // main: '#FF6859',
      // main: '#FFCF44',
      // main: '#B15DFF',
      // main: '#72DEFF',
    },
    type:'dark'
  },
});



type Action = { type: 'LIGHT' | 'DARK'};
const reducer = (state:Theme, action: Action): Theme => {
  switch (action.type) {
    case 'LIGHT':
      console.log(lightTheme)
      return lightTheme;
    case 'DARK':
      console.log(darkTheme)
      return darkTheme;
   default:
      return state
  }
}

export default interface AppThemeContextProps {
  dispatch: React.Dispatch<Action>;
}

const AppThemeContext = React.createContext({} as AppThemeContextProps);

function AppThemeContextProvider({children}: {children:JSX.Element}) {

  const [state, dispatch] = useReducer(reducer, lightTheme);

  const contextProps = {
    dispatch:dispatch
  } as AppThemeContextProps

  return (
  <AppThemeContext.Provider value={contextProps}>
    <ThemeProvider theme={state}>
        {children}
    </ThemeProvider>
  </AppThemeContext.Provider>
  )
}

export { AppThemeContext, AppThemeContextProvider};
