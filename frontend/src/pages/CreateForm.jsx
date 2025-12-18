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
  AlertCircle 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CreateForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    heartRate: "",
    spo2: "",
    temperature: "",
    systolic: "",
    diastolic: "",
    problemArea: "",
    throat: { difficultySwallowing: false, throatPain: false },
    skin: { rash: false, itching: false, swelling: false, redness: false },
    respiratory: { breathlessness: false, chestTightness: false },
    cardiovascular: { chestPain: false },
    diabetes: { bloodSugar: "", frequentThirst: false, frequentUrination: false },
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNestedChange = (section, field) => {
    setForm({
      ...form,
      [section]: { ...form[section], [field]: !form[section][field] }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        heartRate: Number(form.heartRate),
        spo2: Number(form.spo2),
        temperature: Number(form.temperature),
        bloodPressure: { systolic: Number(form.systolic), diastolic: Number(form.diastolic) },
        problemArea: form.problemArea,
        throat: form.throat,
        skin: form.skin,
        respiratory: form.respiratory,
        cardiovascular: form.cardiovascular,
        diabetes: { ...form.diabetes, bloodSugar: form.diabetes.bloodSugar ? Number(form.diabetes.bloodSugar) : null }
      };

      await createForm(payload);
      toast.success("Assessment Recorded", {
        style: { borderRadius: '16px', background: '#292524', color: '#fff' }
      });
      navigate("/forms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
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
        className="max-w-xl mx-auto"
      >
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= i ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"
              }`}>
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && <div className={`w-12 md:w-20 h-[2px] mx-2 ${step > i ? "bg-stone-900" : "bg-stone-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-stone-100 rounded-[40px] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(100,80,60,0.08)]">
          
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Health Check</h1>
            <p className="text-stone-500 text-sm mt-1 font-medium">
              {step === 1 && "Start with your basic vitals"}
              {step === 2 && "Identify the primary concern"}
              {step === 3 && "Specify your symptoms"}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {/* STEP 1: VITALS */}
            {step === 1 && (
              <motion.div 
                key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <VitalInput icon={<Heart size={16}/>} name="heartRate" placeholder="BPM" label="Heart Rate" onChange={handleChange} value={form.heartRate} />
                  <VitalInput icon={<Activity size={16}/>} name="spo2" placeholder="%" label="SpO2" onChange={handleChange} value={form.spo2} />
                </div>
                <VitalInput icon={<Thermometer size={16}/>} name="temperature" placeholder="°C" label="Body Temp" onChange={handleChange} value={form.temperature} />
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100 mt-4">
                  <VitalInput name="systolic" placeholder="mmHg" label="Systolic BP" onChange={handleChange} value={form.systolic} />
                  <VitalInput name="diastolic" placeholder="mmHg" label="Diastolic BP" onChange={handleChange} value={form.diastolic} />
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold mt-6 flex items-center justify-center gap-2">
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: PROBLEM AREA */}
            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  {["throat", "skin", "respiratory", "cardiovascular", "diabetes"].map((area) => (
                    <button
                      key={area}
                      onClick={() => setForm({ ...form, problemArea: area })}
                      className={`w-full p-5 rounded-2xl border text-left font-bold capitalize transition-all ${
                        form.problemArea === area ? "bg-stone-900 text-white border-stone-900" : "bg-stone-50 text-stone-600 border-stone-100 hover:border-stone-300"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={() => form.problemArea && setStep(3)} disabled={!form.problemArea} className="flex-[2] bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                    Next Details <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SYMPTOMS */}
            {step === 3 && (
              <motion.div 
                key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="bg-stone-50 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Check all that apply</h3>
                  
                  {form.problemArea === "throat" && ["difficultySwallowing", "throatPain"].map(f => (
                    <Checkbox key={f} label={f.replace(/([A-Z])/g, ' $1')} checked={form.throat[f]} onChange={() => handleNestedChange("throat", f)} />
                  ))}

                  {form.problemArea === "skin" && Object.keys(form.skin).map(s => (
                    <Checkbox key={s} label={s} checked={form.skin[s]} onChange={() => handleNestedChange("skin", s)} />
                  ))}

                  {form.problemArea === "diabetes" && (
                    <div className="space-y-4">
                      <VitalInput name="bloodSugar" placeholder="mg/dL" label="Blood Sugar Level" onChange={(e) => setForm({...form, diabetes: {...form.diabetes, bloodSugar: e.target.value}})} value={form.diabetes.bloodSugar} />
                      <Checkbox label="Frequent Thirst" checked={form.diabetes.frequentThirst} onChange={() => handleNestedChange("diabetes", "frequentThirst")} />
                      <Checkbox label="Frequent Urination" checked={form.diabetes.frequentUrination} onChange={() => handleNestedChange("diabetes", "frequentUrination")} />
                    </div>
                  )}

                  {/* Add other conditions similarly */}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-stone-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-stone-200">
                    {loading ? "Recording..." : "Complete Submission"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function VitalInput({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">{icon}</div>}
        <input {...props} className={`w-full ${icon ? 'pl-10' : 'px-5'} py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:bg-white focus:border-stone-400 transition-all outline-none font-bold text-stone-900 placeholder-stone-300`} />
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-4 bg-white border border-stone-100 rounded-2xl cursor-pointer hover:border-stone-300 transition-all">
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-stone-900 border-stone-900" : "bg-white border-stone-200"}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className="text-sm font-bold text-stone-700 capitalize">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    </label>
  );
}