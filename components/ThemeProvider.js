import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue
  }
});

// export const theme;

const Theme = props => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </MuiThemeProvider>
);

export default Theme;

// export const themeProvider = Component => {
//   return function WithRoot(props) {
//     return (
//       <MuiThemeProvider theme={theme}>
//         <CssBaseline />
//         <Component {...props} />
//       </MuiThemeProvider>
//     );
//   };
// };
