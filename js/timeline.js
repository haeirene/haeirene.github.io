window.addEventListener("load", () => {
    let audio = document.querySelector(".audio");
    audioHandler();
    let playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Automatic playback started!
            // Show playing UI.
        })
        .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
        });
    }

    let timelineContainer = document.querySelector(".timeline");
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let counterMonth = 1;

    let startYear = 1930;
    let lastYear = 2030;

    for(let i  = startYear; i < lastYear; i++){
        let currentTxt = timelineContainer.innerHTML;
        let monthTxt = "<ul>";

        for(let j = 0; j < 12; j++){
            // first month in the timeline
            if(counterMonth === 1){
                monthTxt = monthTxt + "<li id='" + i + "-" + months[j] + "-" + counterMonth + "' class='timeline___month timeline___month---current'><div class='timeline___circle'></div>" + "<p>" + months[j] + "</p>" +  "</li>";
            }
            // last month in the timeline
            else if(counterMonth === 1200){
                monthTxt = monthTxt + "<li id='" + i + "-" + months[j] + "-" + counterMonth + "' class='lastmonth timeline___month'><div class='timeline___circle'></div>" + "<p>" + months[j] + "</p>" + "</li>";
            }
            else{
                monthTxt = monthTxt + "<li id='" + i + "-" + months[j] + "-" + counterMonth + "' class='timeline___month'><div class='timeline___circle'></div>" + "<p>" + months[j] + "</p>" + "</li>";
            }

            if(j === 11){
                monthTxt = monthTxt + "</ul>";
            }

            counterMonth++;
        }

        timelineContainer.innerHTML = currentTxt + "<li><p>" + i + "</p>" + monthTxt + "</li>";
    }

    timelineContainer.innerHTML = timelineContainer.innerHTML + "<li class='placeholder'></li>"

    // Scoll events
    let allMonths = document.querySelectorAll(".timeline___month");
    
    document.addEventListener("scroll", (event) => {
        // MATH
        let lastY = 23290; //last possible scroll position
        let amountOfMonths = lastY / 1200;

        // TIMELINE
        let currentMonth = document.querySelector(".timeline___month---current");

        if(currentMonth){
            // Math.floor() = round down
            let getCurrentMonth = Math.floor(window.scrollY / amountOfMonths);

            if(getCurrentMonth < allMonths.length){
                currentMonth.classList.remove("timeline___month---current");
                allMonths[getCurrentMonth].classList.add("timeline___month---current");
            }
        }
    });

    let url = `/data/events/events.json`;
    let eventsContainer = document.querySelector(".events");

    function checkCountry(country){
        let txt = "";

        switch(country){
            case "be":
                txt = "Belgium";
                break;
            case "ch":
                txt = "China";
                break;
            case "eu":
                txt = "EU";
                break;
            case "jp":
                txt = "Japan";
                break;
            case "uk":
                txt = "UK";
                break;
            case "usa":
                txt = "USA";
                break;
            case "ussr":
                txt = "USSR";
                break;
            default:
                txt = "international";
                break;
        }

        return txt;
    }

    function audioHandler(){
        let celestialBody = "";
        
        celestialBody = document.querySelector(".celestial_body---selected").getElementsByTagName("a")[0].innerHTML;

        if(celestialBody )
        switch(celestialBody){
            case "Mercury":
                audio.src = "data/events/audio/sun_sonification.wav";
                break;
            case "Venus":
                audio.src = "data/events/audio/venus.mp3";
                break;
            case "Venus":
                audio.src = "data/events/audio/mars.wav";
                break;
            case "Moon":
                audio.src = "data/events/audio/moon.m4a";
                break;
            case "Mars":
                audio.src = "data/events/audio/mars.wav";
                break;
            case "Jupiter":
                audio.src = "data/events/audio/jupiter.wav";
                break;
            case "Saturn":
                audio.src = "data/events/audio/saturn.mp4";
                break;
            case "Uranus":
                audio.src = "data/events/audio/uranus.m4a";
                break;
            case "Neptune":
                audio.src = "data/events/audio/neptune.m4a";
                break;
            case "Pluto":
                audio.src = "data/events/audio/sun_sonification.wav";
                break;
            default:
                audio.src = "data/events/audio/sun_sonification.wav";
                break;
        }
    }
    
    fetch(url)
        .then(response => response.text())
        .then(data => {
            try {
                let eventData = JSON.parse(data);
                let events = eventData.events;
                let audio = document.querySelector(".audio");

                for(let i = 0; i < Object.keys(events).length; i++){
                    let currentTxt = eventsContainer.innerHTML;
                    let audioTxt = "";
                    let layout;
                    let classLayout;
                    let isPlaceholder = false;
                    let categories = "";
    
                    switch(events[i].media_layout){
                        case "image":
                            layout = `<figure><img src="data/events/images/${events[i].media.image}" alt="${events[i].media.alt}"></figure>`
                            classLayout = "image";
                            isPlaceholder = false;
                            break;
                        case "audio":
                            layout = `<p class="events___event---audiotxt">${events[i].media.text}</p>`;
                            classLayout = "audio";
                            isPlaceholder = false;
                            break;
                        case "text":
                            layout = `<p class="events___event---audiotxt">${events[i].media.text}</p>`; 
                            classLayout = "text";
                            break;
                        case "placeholder":
                            classLayout = "placeholder";
                            isPlaceholder = true;
                            break;
                        default:
                            layout = "";
                            isPlaceholder = true;
                            break;
                    }

                    let eCategory = events[i].category;
                    let j = 0;

                    if(eCategory){
                        eCategory.forEach((element) => {
                            if(j === 0){
                                categories = element;
                            }
                            else{
                                categories = categories + ", " + element;
                            }

                            j++;
                        });
                    }
    
                    if(isPlaceholder){
                        if(events[i].date.year === 1930 && events[i].date.month === "January"){
                            eventsContainer.innerHTML = currentTxt + `<li id="e-${events[i].date.year}-${events[i].date.month}" class="events___event events___event---current events___event---${classLayout}"></li>`;
                        }
                        else{
                            eventsContainer.innerHTML = currentTxt + `<li id="e-${events[i].date.year}-${events[i].date.month}" class="events___event events___event---${classLayout}"></li>`;
                        }   
                    }
                    else{
                        let isFlag = '';
                        let countries = checkCountry(events[i].countries);

                        // Custom countries
                        if(events[i].countries === "international"){
                            isFlag = '<img class="event---flag" src="data/events/images/international.png" alt="Icon of the world">';
                        }
                        else if(Array.isArray(events[i].countries)){
                            isFlag =
                                '<img class="event---flag event---flag-first" src="data/events/images/' + events[i].countries[0] + '.png" alt="Flag of ' + events[i].countries[0] + '">' +
                                '<img class="event---flag" src="data/events/images/' + events[i].countries[1] + '.png" alt="Flag of ' + events[i].countries[1] + '">';

                            countries = checkCountry(events[i].countries[0]) + " and " + checkCountry(events[i].countries[1]);
                        }
                        else{
                            isFlag = '<img class="event---flag" src="data/events/images/' + events[i].countries + '.png" alt="Flag of ' + events[i].countries + '">';
                        }

                        // Custom countries
                        let isDate = '';
                        if(events[i].date.month === "January" && events[i].date.day === 0){
                            isDate = events[i].date.year;
                        }
                        else{
                            isDate = events[i].date.year + ", " + events[i].date.month + " " + events[i].date.day;
                        }

                        // Audio
                        if(events[i].media_layout === "audio"){
                            audioTxt = `<p class="audio---source" hidden>${events[i].media.audio}</p>`;
                        }

                        let addTxt = `<li id="e-${events[i].date.year}-${events[i].date.month}" class="events___event events___event---${classLayout}">
                            <h2>${events[i].title}</h2>
                            <h3>${events[i].subtitle}</h3>
                            ${audioTxt}
                            <ul class="event___details">
                                <li class="event___details---left event---calendar"></li>
                                <li class="event___details---right">${isDate}</li>
                                <li class="event___details---left">${isFlag}</li>
                                <li class="event___details---right">${countries}</li>
                                <li class="event___details---left event---category"></li>
                                <li class="event___details---right">${categories}</li>
                            </ul>
                            ${layout}
                        </li>`;
    
                        eventsContainer.innerHTML = currentTxt + "<li>" + addTxt + "</li>";
                    }
                }

                document.addEventListener("scroll", (event) => {
                    // Prevent fast scroll

                    let containerMonth = document.querySelector(".timeline___month---current").parentElement.parentElement;
                    let year = containerMonth.getElementsByTagName("p")[0].innerHTML;
                    let month = document.querySelector(".timeline___month---current").getElementsByTagName("p")[0].innerHTML;

                    let prevEvent = document.querySelector(".events___event---current");

                    let currentEventId = "e-" + year + "-" + month;
                    let currentEvent = document.getElementById(currentEventId);

                    // An event is available
                    if(currentEvent){
                        prevEvent.classList.remove("events___event---current");
                        currentEvent.classList.add("events___event---current");
                            
                        // Background sound
                        if(currentEvent.classList.contains("events___event---audio")){
                            if(currentEvent.querySelector(".audio---source").innerHTML){
                                audio.src = '';
                                audio.src = "data/events/audio/" + currentEvent.querySelector(".audio---source").innerHTML;
                            }
                                            
                            let playPromise = audio.play();
            
                            if (playPromise !== undefined) {
                                playPromise.then(_ => {
                                    // Automatic playback started!
                                    // Show playing UI.
                                })
                                .catch(error => {
                                    // Auto-play was prevented
                                    // Show paused UI.
                                });
                            }
                        }
                        else{
                            // Only go to default audio if the audio is not the default file.
                            if(audio.src != "http://localhost:8001/data/events/audio/sun_sonification.wav"){
                                audioHandler();
                                                
                                let playPromise = audio.play();
                
                                if (playPromise !== undefined) {
                                    playPromise.then(_ => {
                                        // Automatic playback started!
                                        // Show playing UI.
                                        })
                                    .catch(error => {
                                        // Auto-play was prevented
                                        // Show paused UI.
                                    });
                                }
                            }
                            else if(audio.src != "https://haeirene.github.io/data/events/audio/sun_sonification.wav"){
                                audioHandler();
                                                
                                let playPromise = audio.play();
                
                                if (playPromise !== undefined) {
                                    playPromise.then(_ => {
                                    // Automatic playback started!
                                    // Show playing UI.
                                    })
                                    .catch(error => {
                                        // Auto-play was prevented
                                        // Show paused UI.
                                    });
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.log("Error:" + error);
            };
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});