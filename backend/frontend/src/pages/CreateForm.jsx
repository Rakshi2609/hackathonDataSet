import { useState } from "react";
import { createForm } from "../services/formService";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form state
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // For checkboxes inside symptom groups
  const handleNestedChange = (section, field) => {
    setForm({
      ...form,
      [section]: { 
        ...form[section], 
        [field]: !form[section][field] 
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        heartRate: Number(form.heartRate),
        spo2: Number(form.spo2),
        temperature: Number(form.temperature),
        bloodPressure: {
          systolic: Number(form.systolic),
          diastolic: Number(form.diastolic),
        },
        problemArea: form.problemArea,
        throat: form.throat,
        skin: form.skin,
        respiratory: form.respiratory,
        cardiovascular: form.cardiovascular,
        diabetes: {
          ...form.diabetes,
          bloodSugar: form.diabetes.bloodSugar ? Number(form.diabetes.bloodSugar) : null
        }
      };

      await createForm(payload);
      alert("Form submitted!");
      navigate("/forms");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Health Assessment Form</h1>

      {/* ----------- STEP 1 → VITALS ----------- */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="number"
            name="heartRate"
            placeholder="Heart Rate"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="spo2"
            placeholder="SpO2"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="temperature"
            placeholder="Temperature"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="systolic"
            placeholder="Systolic BP"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="diastolic"
            placeholder="Diastolic BP"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={() => setStep(2)}
            className="mt-3 w-full bg-blue-600 text-white p-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* ----------- STEP 2 → PROBLEM AREA ----------- */}
      {step === 2 && (
        <div className="space-y-4">
          <select
            name="problemArea"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select problem area</option>
            <option value="throat">Throat</option>
            <option value="skin">Skin</option>
            <option value="respiratory">Respiratory</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="diabetes">Diabetes</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ----------- STEP 3 → DYNAMIC SYMPTOMS ----------- */}
      {step === 3 && (
        <div className="space-y-4">

          {/* Throat */}
          {form.problemArea === "throat" && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={form.throat.difficultySwallowing}
                  onChange={() => handleNestedChange("throat", "difficultySwallowing")}
                /> Difficulty Swallowing
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={form.throat.throatPain}
                  onChange={() => handleNestedChange("throat", "throatPain")}
                /> Throat Pain
              </label>
            </>
          )}

          {/* Skin */}
          {form.problemArea === "skin" && (
            <>
              {Object.keys(form.skin).map((symptom) => (
                <label key={symptom} className="block">
                  <input
                    type="checkbox"
                    checked={form.skin[symptom]}
                    onChange={() => handleNestedChange("skin", symptom)}
                  />{" "}
                  {symptom}
                </label>
              ))}
            </>
          )}

          {/* Respiratory */}
          {form.problemArea === "respiratory" && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={form.respiratory.breathlessness}
                  onChange={() => handleNestedChange("respiratory", "breathlessness")}
                /> Breathlessness
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={form.respiratory.chestTightness}
                  onChange={() => handleNestedChange("respiratory", "chestTightness")}
                /> Chest Tightness
              </label>
            </>
          )}

          {/* Cardiovascular */}
          {form.problemArea === "cardiovascular" && (
            <label>
              <input
                type="checkbox"
                checked={form.cardiovascular.chestPain}
                onChange={() => handleNestedChange("cardiovascular", "chestPain")}
              /> Chest Pain
            </label>
          )}

          {/* Diabetes */}
          {form.problemArea === "diabetes" && (
            <>
              <input
                type="number"
                placeholder="Blood Sugar"
                value={form.diabetes.bloodSugar}
                onChange={(e) =>
                  setForm({
                    ...form,
                    diabetes: { ...form.diabetes, bloodSugar: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              />

              <label>
                <input
                  type="checkbox"
                  checked={form.diabetes.frequentThirst}
                  onChange={() => handleNestedChange("diabetes", "frequentThirst")}
                /> Frequent Thirst
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={form.diabetes.frequentUrination}
                  onChange={() => handleNestedChange("diabetes", "frequentUrination")}
                /> Frequent Urination
              </label>
            </>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
