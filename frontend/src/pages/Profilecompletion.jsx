

function ProfileComplete({ details, setDetails, onClose }) {
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Details updated successfully!");
    onClose();
  };

  return (
    <div className="absolute top-16 right-4 bg-white p-4 shadow-lg rounded-lg w-80">
      <h3 className="text-lg font-semibold mb-2">Update Nutrition Details</h3>

      <label className="block">Age:</label>
      <input
        type="number"
        name="age"
        value={details.age}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      />

      <label className="block">Current Weight:</label>
      <input
        type="number"
        name="weight"
        value={details.weight}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      />

      <label className="block">Target Weight:</label>
      <input
        type="number"
        name="targetWeight"
        value={details.targetWeight}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      />
           <label className="block">Height:</label>
      <input
        type="number"
        name="height"
        value={details.height}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      />
      <label className="block">Diet Preference:</label>
      <select
        name="dietPreference"
        value={details.dietPreference}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="">Select</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Non-Vegetarian">Non-Vegetarian</option>
        <option value="Eggitarian">Eggitarian</option>
      </select>

      <div className="flex justify-between mt-4">
        <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default ProfileComplete;
