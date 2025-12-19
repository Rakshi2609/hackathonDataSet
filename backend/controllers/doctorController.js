import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load doctors from JSON file
const doctorsPath = join(__dirname, "../data/doctors.json");
let mockDoctors = [];

try {
  const doctorsData = readFileSync(doctorsPath, "utf-8");
  mockDoctors = JSON.parse(doctorsData);
  console.log(`✅ Loaded ${mockDoctors.length} doctors from database`);
} catch (error) {
  console.error("❌ Error loading doctors data:", error);
  mockDoctors = [];
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Get nearby doctors
export const getNearbyDoctors = async (req, res) => {
  try {
    const { lat, lng, radius = 10, specialty } = req.query;
    
    console.log("🔍 Searching for nearby doctors...");
    console.log("📍 User Location:", { lat, lng });
    console.log("📏 Search Radius:", radius, "km");
    console.log("🏥 Specialty Filter:", specialty || "All");

    let doctors = [...mockDoctors];

    // Filter by location if coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const searchRadius = parseFloat(radius);

      doctors = doctors.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          userLat,
          userLng,
          doctor.location.lat,
          doctor.location.lng
        ).toFixed(2)
      })).filter(doctor => doctor.distance <= searchRadius)
        .sort((a, b) => a.distance - b.distance);
    }

    // Filter by specialty if provided
    if (specialty && specialty !== "all") {
      doctors = doctors.filter(
        doctor => doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
      console.log(`✅ Filtered by specialty: ${doctors.length} doctors found`);
    }

    console.log(`✅ Total doctors found: ${doctors.length}`);
    console.log("📋 Doctors:", doctors.map(d => ({
      name: d.name,
      clinic: d.clinic,
      availability: d.availability,
      contact: d.contact,
      distance: d.distance ? `${d.distance} km` : "N/A"
    })));

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    console.error("Get Nearby Doctors Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔎 Fetching doctor with ID: ${id}`);
    
    const doctor = mockDoctors.find(d => d.id === parseInt(id));

    if (!doctor) {
      console.log(`❌ Doctor not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    console.log(`✅ Found doctor: ${doctor.name} at ${doctor.clinic}`);
    console.log(`📞 Contact: ${doctor.contact}`);
    console.log(`🕐 Availability: ${doctor.availability}`);

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error("Get Doctor Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }console.log(`📚 Available specialties: ${specialties.length}`);
    console.log("🏥 Specialties:", specialties);
    
};

// Get all specialties
export const getSpecialties = async (req, res) => {
  try {
    const specialties = [...new Set(mockDoctors.map(d => d.specialty))];
    
    res.status(200).json({
      success: true,
      specialties
    });
  } catch (error) {
    console.error("Get Specialties Error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
