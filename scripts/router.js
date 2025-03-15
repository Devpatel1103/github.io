"use strict";

import {LoadHeader} from "./header.js";

export class Router {

    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    // The popstate event fires when the user click the back or forward button in the browser
    // necessary to ensure the SPA updates content when the browser history is called or changes.
    init(){
        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] Initial page load:${path}`);
            this.loadRoute(path);
        });

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to...`);
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path){
        location.hash = path;
    }

    loadRoute(path){
        console.log(`[INFO] Loading route: ${path}`);

        // Extract the base path  -> #/edit#contact_12345
        const basePath = path.split("#")[0];

        if(!this.routes[basePath]){
            console.warn(`[WARNING] Route not found: ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404"
        }

        fetch(this.routes[basePath])
            .then(response => {
                if(!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}`);
                return response.text();
            })
            .then(html => {
                document.querySelector("main").innerHTML = html;

                LoadHeader().then( () => {
                    //fire an event called "routeLoaded", that notified when a new route has successfully loaded
                    document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath}));
                });
            })
            .catch(error => {
                console.error("[ERROR] Error loading page: ", error);
            })



    }



}