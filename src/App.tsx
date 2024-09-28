import ThemeProvider from "./utilities/context";
import SubAppn from "./SubAppn";

function App() {
  return (
    <ThemeProvider>
      <SubAppn />
    </ThemeProvider>
  );
}

export default App;
