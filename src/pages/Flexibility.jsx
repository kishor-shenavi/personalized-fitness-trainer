import React, { useState } from "react";
import PoseCard from "../components/PoseCard";

const poses = [
  {
    "name": "Cat Cow Stretch",
    "image": "/cat_cow_pose.jpg",
    "level": "basic",
    "description": "A gentle flow between two poses that warms up the spine and relieves tension.",
    "steps": [
      "1. Start on your hands and knees with your wrists under your shoulders and knees under your hips.",
      "2. Inhale and arch your back, lifting your head and tailbone (Cat Pose).",
      "3. Exhale and round your spine, tucking your chin to your chest (Cow Pose).",
      "4. Repeat the movement smoothly for several breaths.",
      "5. Finish by returning to a neutral spine position."
    ]
  },
  {
    "name": "Downward Dog (Adho Mukha Svanasana)",
    "image": "https://example.com/downward_dog.jpg",
    "level": "intermediate",
    "description": "A full-body stretch that strengthens the arms and legs while elongating the spine.",
    "steps": [
      "1. Start on your hands and knees with hands shoulder-width apart.",
      "2. Curl your toes under and lift your knees off the floor.",
      "3. Push your hips up and back, straightening your legs.",
      "4. Keep your hands pressing firmly into the mat, shoulders relaxed.",
      "5. Hold the pose for 30-60 seconds, breathing deeply."
    ]
  },
  {
    "name": "Child's Pose",
   "image": "/child_pose.jpg",
    "level": "basic",
    "description": "A resting pose that gently stretches the lower back and calms the mind.",
    "steps": [
      "1. Kneel on the floor with your toes together and knees hip-width apart.",
      "2. On an exhale, lower your torso between your knees.",
      "3. Extend your arms forward with palms facing down.",
      "4. Relax your shoulders and bring your forehead to the floor.",
      "5. Hold the pose and breathe deeply."
    ]
  },
  {
    "name": "Seated Forward Bend",
    "image": "/Seated_Forward_Bend_pose.jpg",
    "level": "intermediate",
    "description": "A deep hamstring stretch that helps improve flexibility and calm the mind.",
    "steps": [
      "1. Sit with your legs extended straight in front of you.",
      "2. Engage your feet and pull your toes towards your body.",
      "3. Inhale, lengthen your spine, and reach forward with your arms.",
      "4. Exhale and fold forward, keeping your back straight.",
      "5. Hold the pose for 1-3 minutes, breathing deeply."
    ]
  },
  {
    "name": "Cobra Pose",
    "image": "https://example.com/cobra_pose.jpg",
    "level": "intermediate",
    "description": "A gentle backbend that strengthens the spine and opens the chest.",
    "steps": [
      "1. Lie on your stomach with your palms under your shoulders.",
      "2. Keep your elbows tucked close to your body.",
      "3. Inhale and lift your chest off the floor, keeping your elbows bent.",
      "4. Press your pubic bone into the floor and engage your core.",
      "5. Hold for a few breaths, then release back down."
    ]
  },
  {
    "name": "Butterfly Stretch",
    "image": "https://example.com/butterfly_stretch.jpg",
    "level": "basic",
    "description": "A seated stretch that opens the hips and improves flexibility.",
    "steps": [
      "1. Sit on the floor with your legs extended.",
      "2. Bring the soles of your feet together and pull your heels toward your body.",
      "3. Let your knees fall towards the floor.",
      "4. Keep your spine tall and gently lean forward.",
      "5. Hold for 30 seconds, then relax and repeat."
    ]
  },
  {
    "name": "King Pigeon Pose",
    "image": "https://example.com/king_pigeon_pose.jpg",
    "level": "advanced",
    "description": "A deep hip-opener and backbend that requires flexibility and balance.",
    "steps": [
      "1. Start on your hands and knees and bring one leg forward, bending the knee.",
      "2. Extend the opposite leg back and rest your front leg on the mat.",
      "3. Bend the back knee and reach for your foot with the same-side hand.",
      "4. Lift your elbow towards the sky and open your chest.",
      "5. Hold for a few breaths, then switch sides."
    ]
  },
  {
    "name": "Wheel Pose (Chakrasana)",
   "image": "/chakrasan_pose.jpg",
    "level": "advanced",
    "description": "A deep backbend that strengthens the arms, legs, and spine.",
    "steps": [
      "1. Lie on your back with feet hip-width apart and knees bent.",
      "2. Place your palms under your shoulders with fingers pointing towards your feet.",
      "3. Inhale and press into your hands and feet to lift your body.",
      "4. Straighten your arms and legs as much as possible.",
      "5. Hold the pose for 15-30 seconds, then lower down gently."
    ]
  },
  {
    "name": "Dancer's Pose",
    "image": "https://example.com/dancers_pose.jpg",
    "level": "advanced",
    "description": "A balancing pose that strengthens the legs and improves flexibility.",
    "steps": [
      "1. Start in Mountain Pose.",
      "2. Bend your right knee and grab the inside of your right foot.",
      "3. Find balance by keeping your knees together.",
      "4. Extend your left arm forward and reach upwards.",
      "5. Hold for a few breaths, then switch sides."
    ]
  }
  // Add more poses here...
];

function Flexibility() {
  const [selectedLevel, setSelectedLevel] = useState("basic");

  // Filter poses based on selected difficulty
  const filteredPoses = poses.filter((pose) => pose.level === selectedLevel);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Yoga Flexibility Poses</h1>

      {/* Difficulty Level Selection Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["basic", "intermediate", "advanced"].map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedLevel === level ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Display Filtered Poses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoses.map((pose, index) => (
          <PoseCard key={index} {...pose} />
        ))}
      </div>
    </div>
  );
}

export default Flexibility;
