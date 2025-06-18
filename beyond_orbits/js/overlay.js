document.addEventListener("DOMContentLoaded", function(event) {
    // Your code to run since DOM is loaded and ready
    let isFirst = true;
    let refreshTime = new Date().getTime();
    let time = new Date().getTime();

    let isInterfaceActive = false;

    let isOverlayActive = document.querySelector(".overlay---active");
    let main = document.querySelector(".main-interface");

    document.addEventListener("scroll", (event) => {
        time = new Date().getTime();

        isOverlayActive = document.querySelector(".overlay---active");
        main = document.querySelector(".main-interface");

        isOverlayActive = document.querySelector(".overlay---active");
        main = document.querySelector(".main-interface");

        if(document.querySelector(".overlay---active")){
            isOverlayActive.classList.add("overlay---passive");
            isOverlayActive.classList.remove("overlay---active");
        
            main.classList.add("main---active");
            main.classList.remove("main---passive");

            isInterfaceActive = true;
    
            setTimeout(refresh, 10000);
        }
    });
    
    const setActivityTime = (e) => {
        time = new Date().getTime();
    }

    document.body.addEventListener("scroll", setActivityTime);
    document.body.addEventListener("click", setActivityTime);

    const refresh = () => {
        if (new Date().getTime() - time >= 300000) {
            window.location.reload(true);
        } else {
            setTimeout(refresh, 300000);
        }
    }

    setTimeout(refresh, 300000);
});