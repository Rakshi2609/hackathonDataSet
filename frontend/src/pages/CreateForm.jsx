import { useState } from "react";
import { createForm } from "../services/formService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Heart,
  Thermometer,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Camera,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CreateForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    heartRate: "",
    spo2: "",
    temperature: "",
    systolic: "",
    diastolic: "",
    problemArea: "",
    bodyPart: "",
    image: null,
    imagePreview: null,
    throat: { difficultySwallowing: false, throatPain: false },
    skin: { rash: false, itching: false, swelling: false, redness: false },
    respiratory: { breathlessness: false, chestTightness: false },
    cardiovascular: { chestPain: false },
    diabetes: {
      bloodSugar: "",
      frequentThirst: false,
      frequentUrination: false,
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      toast.success("Clinical image captured");
    }
  };

  const handleNestedChange = (section, field) => {
    setForm({
      ...form,
      [section]: { ...form[section], [field]: !form[section][field] },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Basic Vitals
      formData.append("heartRate", Number(form.heartRate));
      formData.append("spo2", Number(form.spo2));
      formData.append("temperature", Number(form.temperature));
      formData.append(
        "bloodPressure",
        JSON.stringify({
          systolic: Number(form.systolic),
          diastolic: Number(form.diastolic),
        })
      );

      // Branching Data
      formData.append("problemArea", form.problemArea);
      formData.append("bodyPart", form.bodyPart);
      if (form.image) formData.append("image", form.image);

      // Detailed Symptoms based on selection
      formData.append(form.problemArea, JSON.stringify(form[form.problemArea]));

      await createForm(formData);
      toast.success("Medical Record Synchronized");
      navigate("/forms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] py-12 px-6 font-['Outfit',sans-serif]">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* --- STEPPER --- */}
        <div className="flex items-center justify-center mb-10 space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                  step >= i
                    ? "bg-stone-900 text-white shadow-lg shadow-stone-200"
                    : "bg-white text-stone-300 border border-stone-100"
                }`}
              >
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`w-12 h-[2px] mx-1 ${
                    step > i ? "bg-stone-900" : "bg-stone-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-stone-100 rounded-[40px] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(100,80,60,0.08)]">
          <AnimatePresence mode="wait">
            {/* STEP 1: VITALS OR PHOTO */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <header className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-stone-900">
                      {isPhotoMode ? "Visual Intake" : "Manual Vitals"}
                    </h1>
                    <p className="text-stone-500 text-sm font-medium">
                      Capture biometric or visual data
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPhotoMode(!isPhotoMode)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-2 rounded-xl"
                  >
                    <ArrowRightLeft size={14} />{" "}
                    {isPhotoMode ? "Use Vitals" : "Use Photo"}
                  </button>
                </header>

                {!isPhotoMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <VitalInput
                        icon={<Heart size={16} />}
                        name="heartRate"
                        placeholder="BPM"
                        label="Heart Rate"
                        onChange={handleChange}
                        value={form.heartRate}
                      />
                      <VitalInput
                        icon={<Activity size={16} />}
                        name="spo2"
                        placeholder="%"
                        label="SpO2"
                        onChange={handleChange}
                        value={form.spo2}
                      />
                    </div>
                    <VitalInput
                      icon={<Thermometer size={16} />}
                      name="temperature"
                      placeholder="°C"
                      label="Body Temp"
                      onChange={handleChange}
                      value={form.temperature}
                    />
                    {/* Blood Pressure Section inside Step 1 */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 mt-4">
                      <VitalInput
                        name="systolic"
                        placeholder="mmHg"
                        label="Systolic BP"
                        onChange={handleChange}
                        value={form.systolic}
                      />
                      <VitalInput
                        name="diastolic"
                        placeholder="mmHg"
                        label="Diastolic BP"
                        onChange={handleChange}
                        value={form.diastolic}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <select
                      name="bodyPart"
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold outline-none appearance-none"
                    >
                      <option value="">Select Analysis Target...</option>
                      <option value="tongue">Tongue</option>
                      <option value="posture">Posture</option>
                    </select>
                    <div className="relative h-60 border-2 border-dashed border-stone-100 rounded-[32px] bg-stone-50/50 flex flex-col items-center justify-center overflow-hidden group">
                      {form.imagePreview ? (
                        <img
                          src={form.imagePreview}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <Camera className="mx-auto text-stone-300 mb-2" />
                          <p className="text-xs font-bold text-stone-400">
                            Tap to Upload
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-stone-900 text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: PROBLEM AREA */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <header>
                  <h1 className="text-3xl font-bold text-stone-900">
                    Focus Area
                  </h1>
                  <p className="text-stone-500 text-sm font-medium">
                    Select primary diagnostic path
                  </p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "throat",
                    "skin",
                    "respiratory",
                    "cardiovascular",
                    "diabetes",
                  ].map((area) => (
                    <button
                      key={area}
                      onClick={() => setForm({ ...form, problemArea: area })}
                      className={`p-5 rounded-[22px] border-2 text-left font-bold capitalize transition-all ${
                        form.problemArea === area
                          ? "bg-stone-900 text-white border-stone-900 shadow-lg"
                          : "bg-white border-stone-100 text-stone-400"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-[22px] font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => form.problemArea && setStep(3)}
                    disabled={!form.problemArea}
                    className="flex-[2] bg-stone-900 text-white py-4 rounded-[22px] font-bold disabled:opacity-30"
                  >
                    Next Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: FULL SYMPTOM LIST */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <header>
                  <h1 className="text-3xl font-bold text-stone-900">
                    Symptom Log
                  </h1>
                  <p className="text-stone-500 text-sm font-medium">
                    Refining details for {form.problemArea}
                  </p>
                </header>

                <div className="bg-stone-50 p-6 rounded-[32px] space-y-3">
                  {form.problemArea === "throat" &&
                    ["difficultySwallowing", "throatPain"].map((f) => (
                      <Checkbox
                        key={f}
                        label={f.replace(/([A-Z])/g, " $1")}
                        checked={form.throat[f]}
                        onChange={() => handleNestedChange("throat", f)}
                      />
                    ))}

                  {form.problemArea === "skin" &&
                    Object.keys(form.skin).map((s) => (
                      <Checkbox
                        key={s}
                        label={s}
                        checked={form.skin[s]}
                        onChange={() => handleNestedChange("skin", s)}
                      />
                    ))}

                  {form.problemArea === "respiratory" &&
                    ["breathlessness", "chestTightness"].map((f) => (
                      <Checkbox
                        key={f}
                        label={f}
                        checked={form.respiratory[f]}
                        onChange={() => handleNestedChange("respiratory", f)}
                      />
                    ))}

                  {form.problemArea === "cardiovascular" && (
                    <Checkbox
                      label="Chest Pain"
                      checked={form.cardiovascular.chestPain}
                      onChange={() =>
                        handleNestedChange("cardiovascular", "chestPain")
                      }
                    />
                  )}

                  {form.problemArea === "diabetes" && (
                    <div className="space-y-4">
                      <VitalInput
                        name="bloodSugar"
                        placeholder="mg/dL"
                        label="Blood Sugar"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            diabetes: {
                              ...form.diabetes,
                              bloodSugar: e.target.value,
                            },
                          })
                        }
                        value={form.diabetes.bloodSugar}
                      />
                      <Checkbox
                        label="Frequent Thirst"
                        checked={form.diabetes.frequentThirst}
                        onChange={() =>
                          handleNestedChange("diabetes", "frequentThirst")
                        }
                      />
                      <Checkbox
                        label="Frequent Urination"
                        checked={form.diabetes.frequentUrination}
                        onChange={() =>
                          handleNestedChange("diabetes", "frequentUrination")
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-[22px] font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-stone-900 text-white py-4 rounded-[22px] font-bold shadow-xl shadow-stone-200"
                  >
                    {loading ? "Synchronizing..." : "Finalize Record"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-stone-400 text-[10px] font-bold tracking-widest uppercase">
          <ShieldCheck size={12} /> Secure Clinical Transmission
        </div>
      </motion.div>
    </div>
  );
}

function VitalInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5 flex-1 text-left">
      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full ${
            icon ? "pl-11" : "px-5"
          } py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-400 outline-none font-bold text-stone-900 transition-all`}
        />
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-4 p-5 bg-white border border-stone-100 rounded-2xl cursor-pointer hover:border-stone-900 transition-all text-left">
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          checked
            ? "bg-stone-900 border-stone-900"
            : "bg-stone-50 border-stone-100"
        }`}
      >
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-sm font-bold text-stone-700 capitalize tracking-tight">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
