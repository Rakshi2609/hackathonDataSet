import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Star,
  Phone,
  Clock,
  Stethoscope,
  Activity,
  Filter,
  Navigation
} from "lucide-react";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function NearbyDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);

  useEffect(() => {
    fetchSpecialties();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchDoctors();
    }
  }, [userLocation, selectedSpecialty, searchRadius]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error:", error);
          // Default to New York coordinates if location denied
          setUserLocation({
            lat: 40.7589,
            lng: -73.9851
          });
          toast.error("Using default location");
        }
      );
    } else {
      setUserLocation({
        lat: 40.7589,
        lng: -73.9851
      });
    }
  };

  const fetchSpecialties = async () => {
    try {
      console.log("🔄 Fetching specialties...");
      const response = await axios.get("/doctors/specialties");
      console.log("✅ Specialties loaded:", response.data.specialties);
      setSpecialties(response.data.specialties);
    } catch (error) {
      console.error("❌ Fetch specialties error:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Failed to load specialties");
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: searchRadius,
        ...(selectedSpecialty !== "all" && { specialty: selectedSpecialty })
      };
      
      console.log("🔄 Fetching doctors with params:", params);
      const response = await axios.get("/doctors/nearby", { params });
      console.log("✅ Doctors loaded:", response.data.count, "doctors");
      console.log("📋 Doctor data:", response.data.doctors);
      setDoctors(response.data.doctors);
      toast.success(`Found ${response.data.count} doctors`);
    } catch (error) {
      console.error("❌ Fetch doctors error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      
      const errorMsg = error.response?.data?.message || error.message || "Failed to load doctors";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] font-['Outfit',sans-serif] p-6 md:p-12">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg shadow-stone-300">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Find Nearby Doctors
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Discover healthcare professionals in your area
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Specialty Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">
                <Filter size={12} className="inline mr-1" />
                Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:border-stone-400 transition-all"
              >
                <option value="all">All Specialties</option>
                {specialties.map((specialty, idx) => (
                  <option key={idx} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Radius */}
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">
                <Navigation size={12} className="inline mr-1" />
                Search Radius: {searchRadius} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  {doctors.length} Doctors Found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-stone-900 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-3 h-3 bg-stone-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-3 h-3 bg-stone-900 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-stone-400" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">No doctors found</h3>
            <p className="text-stone-500">Try adjusting your filters or search radius</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {doctors.map((doctor, idx) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Doctor Image */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-stone-900 mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                        {doctor.specialty}
                      </p>
                      {doctor.clinic && (
                        <p className="text-xs text-stone-500 mt-1 font-medium">
                          🏥 {doctor.clinic}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating & Experience */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-stone-900">
                        {doctor.rating}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-stone-500">
                      {doctor.experience}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-stone-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {doctor.location.address}
                      </p>
                    </div>
                    
                    {doctor.distance && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full">
                        <Navigation size={10} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600">
                          {doctor.distance} km away
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact & Availability */}
                  <div className="space-y-2 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-stone-400" />
                      <a
                        href={`tel:${doctor.contact}`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        {doctor.contact}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-stone-400" />
                      <span className="text-xs text-stone-600">
                        {doctor.availability}
                      </span>
                    </div>
                  </div>

                  {/* Book Appointment Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 px-4 py-3 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all"
                  >
                    Book Appointment
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
