import {
  FaMoon,
  FaSun,
} from "react-icons/fa";

function ThemeToggle({
  darkMode,
  setDarkMode,
}) {

  function toggleTheme() {

    const newTheme =
      !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "spendwise_theme",
      JSON.stringify(newTheme)
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
    >

      {darkMode
        ? <FaSun />
        : <FaMoon />}

    </button>
  );
}

export default ThemeToggle;