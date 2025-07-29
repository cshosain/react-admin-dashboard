import { createContext, useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

type Props = {
  children: React.ReactElement | React.ReactElement[];
};
interface MyContextValue {
  theme: string;
  handleSetScreen: (newValue: string) => void;
}
export const ThemeContext = createContext<MyContextValue>({
  theme: "",
  handleSetScreen: () => { },
});
const ThemeProvider = (props: Props) => {
  const { setItem, getItem } = useLocalStorage("screen");

  const [theme, setTheme] = useState(getItem());

  useEffect(() => {
    const currentTheme = getItem();
    setTheme(currentTheme);
    console.log(currentTheme);
  }, [theme]);

  function handleSetScreen(currentItem: string) {
    if (currentItem === "dark") {
      setItem("light");
      setTheme("light");
    }
    if (currentItem === "light") {
      setItem("dark");
      setTheme("dark");
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, handleSetScreen }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
