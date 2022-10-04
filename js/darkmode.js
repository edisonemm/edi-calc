const darkModeBtn = document.querySelector(".darkmodeBtn")
const html = document.documentElement

const darkmodeStorage = localStorage.getItem("darkmode")
/* OPTION 1 */
switch (darkmodeStorage) {
    case "dark": setDarkMode(); break;
    case "ligth": setLigthMode(); break;
    default:
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode()
        }
}
/* OPTION 2 */
// if (darkmodeStorage) {
//     if (darkmodeStorage === "dark") setDarkMode()
//     if (darkmodeStorage === "ligth") setLigthMode()
// } else {
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         setDarkMode()
//     }
// }

darkModeBtn.addEventListener("click", e => {
    html.classList.toggle("dark-mode")
    localStorage.setItem("darkmode", e.target.getAttribute("data-setmode"))
})



function setDarkMode() {
    html.classList.add("dark-mode")
}
function setLigthMode() {
    html.classList.remove("dark-mode")
}