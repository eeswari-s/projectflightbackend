import Flight from "../Models/flightModel.js";

// ✅ Create Flight (Admin only)
export const createFlight = async (req, res) => {
    try {
        const newFlight = new Flight(req.body);
        await newFlight.save();
        res.status(201).json({ message: "Flight created successfully!", flight: newFlight });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get All Flights (Both User & Admin)
export const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Filter Flights (By origin, destination, date)
export const filterFlights = async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        const filters = {};
        if (origin) filters.origin = origin;
        if (destination) filters.destination = destination;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59);
            filters.departureTime = { $gte: startDate, $lte: endDate };
        }

        const flights = await Flight.find(filters);
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update Flight (Admin only)
export const updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Flight updated successfully!", flight });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete Flight (Admin only)
export const deleteFlight = async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Flight deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
