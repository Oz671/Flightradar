var map, infobox;

async function getLivePlanes() {
    try {
        console.log("getting plane data in progress...");
        let response = await fetch('http://localhost:5501/allFlights/liveFlights');
        response = await response.json();
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {});
    //fetch all planes
    

    //Create an infobox at the center of the map but don't show it.
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false
    });

    //Assign the infobox to a map instance.
    infobox.setMap(map);
    let flights = await getLivePlanes()
    await console.log(flights)
    
     for (let i = 0; i < flights.length; i++) {
            let cordinates = await new Microsoft.Maps.Location(flights[i].lat, flights[i].lng);
            await createRotatedImagePushpin(cordinates, 'airplane.png', flights[i].dir, function (pin) {
                pin.metadata = {
                    title: flights[i].flight_icao,
                    description: "dep.Airport: "+ flights[i].dep_icao +", arr.Airport: "+ flights[i].arr_icao
                    
                };
                //Add a click event handler to the pushpin.
                Microsoft.Maps.Events.addHandler(pin, 'click', pushpinClicked);
                map.entities.push(pin);
            });
        }
}

    //Create a pushpin at a random location in the map bounds.
    
    




function pushpinClicked(e) {
    //Make sure the infobox has metadata to display.
    if (e.target.metadata) {
        //Set the infobox options with the metadata of the pushpin.
        infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.title,
            description: e.target.metadata.description,
            visible: true
        });
    }
}

function createRotatedImagePushpin(location, url, rotationAngle, callback) {
    var img = new Image();
    img.onload = function () {
        var c = document.createElement('canvas');

        var rotationAngleRads = rotationAngle * Math.PI / 180;

        //Calculate rotated image size.
        c.width = Math.abs(Math.ceil(img.width * Math.cos(rotationAngleRads) + img.height * Math.sin(rotationAngleRads)));
        c.height = Math.abs(Math.ceil(img.width * Math.sin(rotationAngleRads) + img.height * Math.cos(rotationAngleRads)));

        var context = c.getContext('2d');

        //Move to the center of the canvas.
        context.translate(c.width / 2, c.height / 2);

        //Rotate the canvas to the specified angle in degrees.
        context.rotate(rotationAngleRads);

        //Draw the image, since the context is rotated, the image will be rotated also.
        context.drawImage(img, -img.width / 2, -img.height / 2);

        var pin = new Microsoft.Maps.Pushpin(location, {
            //Generate a base64 image URL from the canvas.
            icon: c.toDataURL(),
            anchor: new Microsoft.Maps.Point(c.width / 2, c.height / 2) //Anchor to center of image.
        });

        if (callback) {
            callback(pin);
        }
    };

    //Allow cross domain image editting.
    img.crossOrigin = 'anonymous';
    img.src = url;
}