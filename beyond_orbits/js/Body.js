class Body {
    constructor(id, name, filename, startLineId, endLineId, divideBy) {
        this.id = id;
        this.name = name;
        this.filename = filename;
        this.startLineId = startLineId;
        this.endLineId = endLineId;
        this.divideBy = divideBy;
        this.orbits = [];

        // Check
        this.firstDateInDataset = [];
    }

    // Get all the orbit data from the file
    getOrbitData() {
        var url = `../beyond_orbits/data/orbits/${this.filename}`;

        fetch(url)
            .then((response) => response.text())
            .then((data) => {
                try {
                    var planetData = data;
                    planetData = this.parseOrbitData(planetData);
                } catch (error) {
                    console.error("Error", error);
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }

    parseOrbitData(planetData) {
        // Help source: https://github.com/chrishorton/horizons-graphql/blob/master/src/helpers.js

        /*
        Params:
            planetData,Array[String] - Data recieved from the API
        
        Returns:
            rawData,Dictionary{String:String} - keys and values to be matched up to GraphQL schema items
        */
        var planetInfo = {};
        // Create an array for each line of data
        planetInfo = planetData.split("\n");

        // console.log("planetInfo");
        // console.log(planetInfo);

        let startLineId = this.startLineId;
        // Correct endline as we start later but need to stop earlier...
        let threshold = this.endLineId - (this.startLineId - 2);

        let id = 0;
        let arrayId = 0;

        let hasFirstDateSaved = false;

        for (let i = 0; i < threshold; i++) {
            // OPTION SHIFT L
            // Every 2 lines, collect the position of the planet.
            // Line 1 = date + hour
            // Line 2 = x, y, z

            if (i === 0 || i % 2 === 0) {
                let objectId = startLineId + i;

                // Put the text data in the correct object
                this.orbits[arrayId] = [];

                let tempDate = planetInfo[objectId].trim().split(/(\s+)/);
                tempDate = tempDate.slice(2, 7).join("");
                tempDate = tempDate.replace("= A.D. ", "");

                let tempXyz = planetInfo[objectId + 1];
                this.orbits[arrayId]["xyz"] = {};

                this.orbits[arrayId]["date"] = this.convertDate(tempDate);

                // NASA API coordinates (string): X = 9.678055494988328E+07 Y =-6.222849442639988E+07 Z =-2.898905435727756E+0
                // Remove all unecessary values and save each coordinate correctly

                // x
                let x = tempXyz.replace(" ", "");
                x = x.replace("X = ", "");
                x = x.replace("X =", "");
                let y = x;
                x = x.split(" ");

                // y
                y = y.replace(x[0], "");
                y = y.replace(" Y = ", "");
                y = y.replace(" Y =", "");
                y = y.split(" ");

                //TO DO: something goes wrong here
                this.orbits[arrayId]["xyz"]["x"] = parseFloat(x[0]);
                this.orbits[arrayId]["xyz"]["y"] = parseFloat(y[0]);

                arrayId++;
            }

            // Update id
            id++;
        }

        return this.orbits;
    }

    getOrbits() {
        return this.orbits;
    }

    convertDate(date) {
        // Split the date in 3 parts: year, month and days
        date = date.replace("-", " ");
        date = date.replace("-", " ");

        let tempDate = date.split(" ", 3);
        let year = tempDate[0];
        let month;
        let day = tempDate[2];

        let result = [];

        //Month
        switch (tempDate[1]) {
            case "Jan":
                month = 1;
                break;
            case "Feb":
                month = 2;
                break;
            case "Mar":
                month = 3;
                break;
            case "Apr":
                month = 4;
                break;
            case "May":
                month = 5;
                break;
            case "Jun":
                month = 6;
                break;
            case "Jul":
                month = 7;
            case "Aug":
                month = 8;
                break;
            case "Sep":
                month = 9;
                break;
            case "Oct":
                month = 10;
                break;
            case "Nov":
                month = 11;
                break;
            case "Dec":
                month = 12;
                break;
        }

        result["year"] = year;
        result["month"] = month;
        result["day"] = day;

        return result;
    }
}
