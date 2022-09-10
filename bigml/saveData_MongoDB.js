

async function saveDataToMongoDB() {
    try {
      let response = await fetch('http://localhost:5501/allFlighst/saveFlights');
      response = await response.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  setInterval(saveDataToMongoDB, 1000 * 5);