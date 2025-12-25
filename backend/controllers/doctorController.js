import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.params;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Availability changed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const doctorsList = async (req, res) => {
  try {
    // 1. Fetch doctors
    // Use string syntax for select to exclude password and email
    const doctors = await doctorModel.find({}).select("-password -email"); 

    // 2. Return success with data
    res.status(200).json({ 
      success: true, 
      doctors
    });

  } catch (error) {
    console.error("Error in doctorList:", error); // Use console.error for errors

    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export {
  changeAvailability,
  doctorsList,
};