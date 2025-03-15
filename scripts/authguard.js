"use strict";


let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout  = setTimeout( () => {
        console.warn("[WARNING] Session expired due to inactivity");
        sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("SessionExpired"));
    }, 15 * 60 * 1000) //15 minute timout
}

//reset the session timeout if client uses mouse or keyboard
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);


export function AuthGuard() {
    const user = sessionStorage.getItem("user");
    const protectedRoutes = ["/contact-list", "/edit"]

    if(!user && protectedRoutes.includes(location.hash.slice(1))){
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirecting to login page.");
        // dispatch a custom event called sessionExpired
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }else{
        resetSessionTimeout();
    }
}