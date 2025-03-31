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

