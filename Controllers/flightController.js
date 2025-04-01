import Flight from "../Models/flightModel.js";

// **Create Flight**
export const createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json({ message: "Flight added successfully", flight });
  } catch (error) {
    res.status(500).json({ message: "Error adding flight", error });
  }
};

// **Get All Flights**
export const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flights", error });
  }
};

// **Update Flight**
export const updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFlight = await Flight.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFlight) return res.status(404).json({ message: "Flight not found" });

    res.status(200).json({ message: "Flight updated successfully", updatedFlight });
  } catch (error) {
    res.status(500).json({ message: "Error updating flight", error });
  }
};

// **Delete Flight**
export const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFlight = await Flight.findByIdAndDelete(id);
    if (!deletedFlight) return res.status(404).json({ message: "Flight not found" });

    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flight", error });
  }
};

// **Search Flights** ✈️
export const searchFlights = async (req, res) => {
  try {
    console.log("🔍 API Hit Aaguthu"); 

    const { departureFrom, goingTo, departureDate } = req.query;
    const query = {};

    if (departureFrom) query.departureFrom = { $regex: new RegExp(`^${departureFrom}$`, "i") };
    if (goingTo) query.goingTo = { $regex: new RegExp(`^${goingTo}$`, "i") };

    if (departureDate) {
      // Convert the date string into the correct format
      const formattedDate = new Date(departureDate);
      if (!isNaN(formattedDate.getTime())) {
        query.departureDate = {
          $gte: new Date(formattedDate.setHours(0, 0, 0, 0)), 
          $lt: new Date(formattedDate.setHours(23, 59, 59, 999)) 
        };
      } else {
        return res.status(400).json({ message: "Invalid departure date format" });
      }
    }

    console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2)); 

    const flights = await Flight.find(query);
    console.log("📌 Flights Found:", flights.length > 0 ? flights : "No flights found"); 

    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found for this search." });
    }

    res.json(flights);
  } catch (error) {
    console.error("❌ Error fetching flights:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// getFlightById
export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

