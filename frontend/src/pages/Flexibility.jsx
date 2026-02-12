import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PoseCard from '../components/PoseCard';
import { useNavigate } from 'react-router-dom';

function Flexibility() {
  const [selectedLevel, setSelectedLevel] = useState("basic");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPoseId, setExpandedPoseId] = useState(null);
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Explicit API base URL
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPoses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/poses`, {
          params: {
            level: selectedLevel,
            search: searchQuery
          },
          signal: controller.signal
        });
        
        // Debug log
        console.log('API Response:', response.data);
        
        setPoses(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('API Error:', err);
          setError(`Failed to load poses. Please check your connection.`);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPoses, 300);
    
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [selectedLevel, searchQuery, API_BASE_URL]);

  const togglePoseExpansion = (poseId) => {
    setExpandedPoseId(expandedPoseId === poseId ? null : poseId);
  };
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen p-6 ${expandedPoseId !== null ? 'bg-gray-100' : 'bg-[#DEF4FC]'}`}>
      <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors absolute top-[20px] left-[20px]"
              aria-label="Back to home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
      {/* Error message */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="max-w-6xl mx-auto mb-6 p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-indigo-600">Loading poses...</p>
        </div>
      )}

      {/* Header and controls (hidden when pose expanded) */}
      <div className={`max-w-6xl mx-auto ${expandedPoseId !== null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <h1 className="text-4xl font-bold text-center mb-6 text-[#003459]">Yoga Flexibility Poses</h1>
        
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search poses..."
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute right-3 top-3.5 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {["basic", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedLevel === level
                  ? "bg-[#007EA7] text-white shadow-md"
                  : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
              }`}
              onClick={() => setSelectedLevel(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pose Cards Grid */}
      {!loading && poses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No poses found matching your criteria</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${expandedPoseId === null ? 'md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}`}>
          {poses.map((pose) => (
            <div 
              key={pose._id} 
              className={`transition-all duration-300 ${
                expandedPoseId !== null && expandedPoseId !== pose._id ? 'opacity-0 h-0 overflow-hidden' : ''
              }`}
            >
              <PoseCard
                id={pose._id}
                name={pose.name}
                image={pose.image}
                description={pose.description}
                steps={pose.steps}
                video={pose.video}
                isExpanded={expandedPoseId === pose._id}
                onClick={() => togglePoseExpansion(pose._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Flexibility;

















// import React, { useState } from "react";
// import PoseCard from "../components/PoseCard";

// const poses = [
//   {
//     "name": "Tadasana (Mountain Pose)",
//     "image": "/ProjectImages/Tadasana.avif",
//     "level": "basic",
//     "description": "Improves posture and balance.",
//     "steps": [
//       "1. Stand tall with feet together, shoulders relaxed, and arms at your sides.",
//       "2. Distribute weight evenly across both feet.",
//       "3. Engage thighs and lift kneecaps slightly.",
//       "4. Lengthen the spine and reach the crown of your head upward.",
//       "5. Breathe deeply and hold for a few breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Vrikshasana (Tree Pose)",
//     "image": "/ProjectImages/Vrikshasana.jpeg",
//     "level": "basic",
//     "description": "Enhances balance and concentration.",
//     "steps": [
//       "1. Stand tall and shift weight onto one foot.",
//       "2. Place the sole of the opposite foot on the inner thigh or calf.",
//       "3. Bring palms together in front of the chest or extend arms overhead.",
//       "4. Focus on a point ahead and hold the pose.",
//       "5. Switch sides and repeat."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Bhujangasana (Cobra Pose)",
//     "image": "/ProjectImages/Bhujangasana.webp",
//     "level": "basic",
//     "description": "Strengthens the spine and opens the chest.",
//     "steps": [
//       "1. Lie on your stomach with palms under shoulders.",
//       "2. Inhale and lift your chest, keeping elbows slightly bent.",
//       "3. Press your pubic bone into the floor.",
//       "4. Keep shoulders away from ears and hold for a few breaths.",
//       "5. Exhale and lower back down."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Balasana (Child’s Pose)",
//     "image": "/ProjectImages/balasana.avif",
//     "level": "basic",
//     "description": "Relieves stress and stretches the back.",
//     "steps": [
//       "1. Kneel with big toes touching and knees wide apart.",
//       "2. Sit back on your heels and extend arms forward.",
//       "3. Rest forehead on the mat and relax shoulders.",
//       "4. Breathe deeply and hold the pose.",
//       "5. Slowly return to a seated position."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Sukhasana (Easy Pose)",
//     "image": "/ProjectImages/Sukhasana.jpg",
//     "level": "basic",
//     "description": "A meditative posture for relaxation.",
//     "steps": [
//       "1. Sit cross-legged on the floor or a cushion.",
//       "2. Rest hands on knees, palms up or down.",
//       "3. Lengthen your spine and relax your shoulders.",
//       "4. Close your eyes and focus on your breath.",
//       "5. Hold for 1-5 minutes."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Setu Bandhasana (Bridge Pose)",
//     "image": "/ProjectImages/SetuBandhasana.jpg",
//     "level": "basic",
//     "description": "Strengthens the back and glutes.",
//     "steps": [
//       "1. Lie on your back with knees bent and feet hip-width apart.",
//       "2. Press into your feet to lift hips toward the ceiling.",
//       "3. Clasp hands under your back and roll shoulders inward.",
//       "4. Hold for 5-8 breaths, then slowly lower down."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Marjaryasana-Bitilasana (Cat-Cow Pose)",
//     "image": "/ProjectImages/CatCow1.jpg",
   
//     "level": "basic",
//     "description": "Improves spine flexibility.",
//     "steps": [
//       "1. Start on hands and knees in a tabletop position.",
//       "2. Inhale, arch your back (Cow Pose: drop belly, lift chin).",
//       "3. Exhale, round your spine (Cat Pose: tuck chin, draw belly in).",
//       "4. Repeat for 5-10 cycles of breath."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Paschimottanasana (Seated Forward Bend)",
//     "image": "/ProjectImages/Paschimottanasana.jpeg",
//     "level": "basic",
//     "description": "Stretches the hamstrings and spine.",
//     "steps": [
//       "1. Sit with legs extended straight in front.",
//       "2. Inhale and lengthen your spine upward.",
//       "3. Exhale and hinge at hips to fold forward.",
//       "4. Hold your shins, ankles, or feet.",
//       "5. Hold for 5-10 breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Baddha Konasana (Butterfly Pose)",
//     "image": "/ProjectImages/BaddhaKonasana.avif",
//     "level": "basic",
//     "description": "Opens up the hips and groin.",
//     "steps": [
//       "1. Sit with soles of the feet together and knees bent outward.",
//       "2. Hold your feet and sit tall.",
//       "3. Gently flap knees up and down like butterfly wings.",
//       "4. Hold for 1-2 minutes."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Ardha Matsyendrasana (Half Spinal Twist)",
//     "image": "/ProjectImages/ArdhaMatsyendrasana.webp",
//     "level": "basic",
//     "description": "Improves spinal flexibility.",
//     "steps": [
//       "1. Sit with legs extended. Bend right knee and place foot outside left thigh.",
//       "2. Twist torso to the right, hooking left elbow outside right knee.",
//       "3. Hold for 5-8 breaths, then repeat on the other side."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Supta Baddha Konasana (Reclining Butterfly Pose)",
//     "image": "/ProjectImages/Supta-Baddha-Konasana.webp",
//     "level": "basic",
//     "description": "Deep relaxation for hips and thighs.",
//     "steps": [
//       "1. Lie on your back and bring soles of the feet together.",
//       "2. Let knees fall open to the sides.",
//       "3. Place arms at your sides, palms up.",
//       "4. Close your eyes and breathe deeply for 2-5 minutes."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Apanasana (Knees-to-Chest Pose)",
//     "image": "/ProjectImages/Apanasana.jpg",
//     "level": "basic",
//     "description": "Relieves lower back tension.",
//     "steps": [
//       "1. Lie on your back and hug both knees to your chest.",
//       "2. Rock gently side to side to massage the spine.",
//       "3. Hold for 1-2 minutes, breathing deeply."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Utkatasana (Chair Pose)",
//     "image": "/ProjectImages/Utkatasana.avif",
//     "level": "intermediate",
//     "description": "Strengthens legs and core.",
//     "steps": [
//       "1. Stand with feet together. Inhale and raise arms overhead.",
//       "2. Exhale and sit back as if sitting in a chair.",
//       "3. Keep knees behind toes and engage core.",
//       "4. Hold for 5-8 breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Virabhadrasana II (Warrior II Pose)",
//     "image": "/ProjectImages/Virabhadrasana.avif",
//     "level": "intermediate",
//     "description": "Increases stamina and focus.",
//     "steps": [
//       "1. Step feet wide apart. Turn right foot out 90 degrees, left foot in slightly.",
//       "2. Bend right knee over ankle, arms extended parallel to the floor.",
//       "3. Gaze over right fingertips and hold for 5-8 breaths.",
//       "4. Repeat on the other side."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Navasana (Boat Pose)",
//     "image": "/ProjectImages/Navasana.webp",
//     "level": "intermediate",
//     "description": "Strengthens core and improves balance.",
//     "steps": [
//       "1. Sit with knees bent and feet flat. Lean back slightly.",
//       "2. Lift feet off the floor, balancing on sit bones.",
//       "3. Extend arms forward, parallel to the floor.",
//       "4. Hold for 5-10 breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Ardha Chandrasana (Half Moon Pose)",
//     "image": "/ProjectImages/Ardha_Chandrasana.jpg",
//     "level": "intermediate",
//     "description": "Enhances coordination and flexibility.",
//     "steps": [
//       "1. From Warrior II, place left hand on hip and lower right hand to the floor.",
//       "2. Lift left leg parallel to the floor and open hips upward.",
//       "3. Extend left arm toward the ceiling and gaze upward.",
//       "4. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Eka Pada Rajakapotasana (Pigeon Pose)",
//     "image": "/ProjectImages/PigeonPose.jpg",
//     "level": "intermediate",
//     "description": "Stretches the hips and lower back.",
//     "steps": [
//       "1. From Downward Dog, bring right knee forward behind right wrist.",
//       "2. Extend left leg back, keeping hips square.",
//       "3. Lower torso over the front leg or stay upright.",
//       "4. Hold for 5-10 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Dhanurasana (Bow Pose)",
//     "image": "/ProjectImages/Dhanurasana.jpeg",
//     "level": "intermediate",
//     "description": "Strengthens the back and opens the chest.",
//     "steps": [
//       "1. Lie on your stomach. Bend knees and reach back to hold ankles.",
//       "2. Inhale and lift chest and thighs off the floor.",
//       "3. Gaze forward and hold for 5-8 breaths.",
//       "4. Release and rest."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Ustrasana (Camel Pose)",
//     "image": "/ProjectImages/Ustrasana.webp",
//     "level": "intermediate",
//     "description": "Improves spinal flexibility.",
//     "steps": [
//       "1. Kneel with knees hip-width apart. Place hands on lower back.",
//       "2. Inhale and arch back, reaching hands to heels.",
//       "3. Keep hips over knees and chest lifted.",
//       "4. Hold for 5 breaths, then slowly release."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Garudasana (Eagle Pose)",
//     "image": "/ProjectImages/Garudasana.jpg",
//     "level": "intermediate",
//     "description": "Improves balance and flexibility.",
//     "steps": [
//       "1. Stand tall. Cross right thigh over left thigh.",
//       "2. Hook right foot behind left calf.",
//       "3. Cross left arm under right arm and press palms together.",
//       "4. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Salamba Sarvangasana (Shoulder Stand)",
//     "image": "/ProjectImages/ShoulderStand.jpg",
//     "level": "intermediate",
//     "description": "Enhances circulation and balance.",
//     "steps": [
//       "1. Lie on your back. Lift legs and hips upward, supporting lower back with hands.",
//       "2. Keep elbows close and legs straight toward the ceiling.",
//       "3. Hold for 10-30 seconds, then slowly lower down."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Parivrtta Parsvakonasana (Revolved Side Angle Pose)",
//     "image": "/ProjectImages/ParivrttaParsvakonasana.avif",
//     "level": "intermediate",
//     "description": "Strengthens the core and legs.",
//     "steps": [
//       "1. From Warrior II, bring palms together at chest.",
//       "2. Twist torso to the right, hooking left elbow outside right knee.",
//       "3. Extend right arm upward and gaze up.",
//       "4. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Anjaneyasana (Crescent Lunge Pose)",
//     "image": "/ProjectImages/Anjaneyasana.jpg",
//     "level": "intermediate",
//     "description": "Stretches hip flexors and opens the chest.",
//     "steps": [
//       "1. Step right foot forward into a lunge, left knee lowered.",
//       "2. Inhale and raise arms overhead, palms facing each other.",
//       "3. Engage core and tilt pelvis slightly forward.",
//       "4. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Utthita Hasta Padangusthasana (Extended Hand-to-Big-Toe Pose)",
//     "image": "/ProjectImages/HandToToe.jpg",
//     "level": "intermediate",
//     "description": "Improves balance and flexibility.",
//     "steps": [
//       "1. Stand tall. Lift right leg and hold big toe with right hand.",
//       "2. Extend left arm to the side for balance.",
//       "3. Straighten right leg forward or to the side.",
//       "4. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Mayurasana (Peacock Pose)",
//     "image": "/ProjectImages/Mayurasana.avif",
//     "level": "advanced",
//     "description": "Strengthens arms and improves digestion.",
//     "steps": [
//       "1. Kneel and place palms on the floor, fingers pointing backward.",
//       "2. Lean forward, resting abdomen on elbows.",
//       "3. Shift weight forward and lift legs off the floor.",
//       "4. Balance and hold for 3-5 breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Eka Pada Bakasana (One-Legged Crow Pose)",
//     "image": "/ProjectImages/EkaPadaBakasana.avif",
//     "level": "advanced",
//     "description": "Increases arm and core strength.",
//     "steps": [
//       "1. Squat and place palms on the floor shoulder-width apart.",
//       "2. Bend elbows slightly and lift one knee onto the back of the upper arm.",
//       "3. Lean forward, lifting the other leg off the floor.",
//       "4. Hold for 3-5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Pincha Mayurasana (Forearm Stand)",
//     "image": "/ProjectImages/pincha-mayurasana.webp",
//     "level": "advanced",
//     "description": "Improves stability and focus.",
//     "steps": [
//       "1. Start in Dolphin Pose (forearms on the floor).",
//       "2. Walk feet closer to elbows and lift one leg upward.",
//       "3. Kick up into a forearm stand, engaging core and legs.",
//       "4. Hold for 5-10 seconds, then slowly lower."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Kapotasana (King Pigeon Pose)",
//     "image": "/ProjectImages/Kapotasana.jpg",
//     "level": "advanced",
//     "description": "A deep backbend for spine flexibility.",
//     "steps": [
//       "1. Kneel and arch back, reaching hands to heels.",
//       "2. Drop head back and press hips forward.",
//       "3. Hold for 5-8 breaths, then release gently."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Eka Pada Rajakapotasana II (Full Pigeon Pose)",
//     "image": "/ProjectImages/eka-pada-rajakapotasana.avif",
//     "level": "advanced",
//     "description": "Opens the hips and chest.",
//     "steps": [
//       "1. From Pigeon Pose, bend back leg and reach for the foot.",
//       "2. Pull foot toward head while arching the back.",
//       "3. Hold for 5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Titibasana (Firefly Pose)",
//     "image": "/ProjectImages/Titibasana.avif",
//     "level": "advanced",
//     "description": "Strengthens arms and core.",
//     "steps": [
//       "1. Squat and place palms on the floor behind knees.",
//       "2. Shift weight back, lifting hips and straightening legs sideways.",
//       "3. Balance on hands and hold for 3-5 breaths."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Astavakrasana (Eight-Angle Pose)",
//     "image": "/ProjectImages/Astavakrasana.jpg",
//     "level": "advanced",
//     "description": "Improves arm strength and coordination.",
//     "steps": [
//       "1. Sit and hook right leg over left shoulder.",
//       "2. Place palms on the floor and lift hips off the ground.",
//       "3. Cross ankles and extend legs to the side.",
//       "4. Hold for 3-5 breaths, then switch sides."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Sirsasana (Headstand Pose)",
//     "image": "/ProjectImages/sirsasana.jpg",
//     "level": "advanced",
//     "description": "Enhances blood circulation and concentration.",
//     "steps": [
//       "1. Interlace fingers and place forearms on the floor.",
//       "2. Place crown of head on the floor, forming a tripod.",
//       "3. Walk feet closer and lift legs upward, engaging core.",
//       "4. Hold for 10-30 seconds, then slowly lower."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Vrschikasana (Scorpion Pose)",
//     "image": "/ProjectImages/Vrschikasana.jpeg",
//     "level": "advanced",
//     "description": "Deepens backbend and builds control.",
//     "steps": [
//       "1. From Forearm Stand, bend knees and arch back.",
//       "2. Reach feet toward the head, keeping control.",
//       "3. Hold for 3-5 breaths, then slowly release."
//     ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
//   },
//   {
//     "name": "Ganda Bherundasana (Chin Stand)",
//     "image": "/ProjectImages/GandaBherundasana.webp",
//     "level": "advanced",
//     "description": "Strengthens arms and opens the chest.",
//     "steps": [
//       "1. Lie on your stomach and place palms under shoulders.",
//       "2. Press into hands and lift head/chest, balancing on chin and forearms.",
//   "3. Engage legs and lift them upward into a backbend.",
// "4. Hold for 3-5 breaths, then gently release."
// ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
// },
// {
// "name": "Natarajasana (Lord of the Dance Pose)",
// "image": "/ProjectImages/Natarajasana.jpg",
// "level": "advanced",
// "description": "Improves balance, flexibility, and strength.",
// "steps": [
// "1. Stand tall and shift weight to left leg.",
// "2. Bend right knee and reach back to hold right foot.",
// "3. Kick foot into hand as you extend left arm forward.",
// "4. Lean torso forward while lifting right leg higher.",
// "5. Hold for 5 breaths, then switch sides."
// ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
// },
// {
// "name": "Koundinyasana (Sage Koundinya’s Pose)",
// "image": "/ProjectImages/Koundinyasana.jpeg",
// "level": "advanced",
// "description": "Requires arm balance and full-body control.",
// "steps": [
// "1. From Crow Pose, twist torso to the right and extend legs sideways.",
// "2. Balance on hands with legs parallel to the floor.",
// "3. Engage core and hold for 3-5 breaths.",
// "4. Repeat on the other side."
// ],
//     "video": "https://youtu.be/CTrRX7DcBSA"
// }
// ]
    




// import React, { useState, useEffect } from "react";
// import PoseCard from "../components/PoseCard";
// import axios from "axios";

// function Flexibility() {
//   const [selectedLevel, setSelectedLevel] = useState("basic");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedPoseId, setExpandedPoseId] = useState(null);
//   const [poses, setPoses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPoses = async () => {
//       try {
//         const params = {};
//         if (selectedLevel) params.level = selectedLevel;
//         if (searchQuery) params.search = searchQuery;
        
//         const response = await axios.get("http://localhost:5000/api/poses", { params });
//         setPoses(response.data);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching poses:", err);
//         setError("Failed to load poses. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPoses();
//   }, [selectedLevel, searchQuery]);

//   const togglePoseExpansion = (index) => {
//     setExpandedPoseId(expandedPoseId === index ? null : index);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
//           <p className="text-red-500 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-6 ${expandedPoseId !== null ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
//       <div className={`max-w-6xl mx-auto ${expandedPoseId !== null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
//         <h1 className="text-4xl font-bold text-center mb-6 text-indigo-800">Yoga Flexibility Poses</h1>
        
//         <div className="mb-8">
//           <div className="relative max-w-md mx-auto">
//             <input
//               type="text"
//               placeholder="Search poses..."
//               className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <svg className="absolute right-3 top-3.5 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//         </div>

//         <div className="flex justify-center space-x-4 mb-8">
//           {["basic", "intermediate", "advanced"].map((level) => (
//             <button
//               key={level}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${
//                 selectedLevel === level
//                   ? "bg-indigo-600 text-white shadow-md"
//                   : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
//               }`}
//               onClick={() => setSelectedLevel(level)}
//             >
//               {level.charAt(0).toUpperCase() + level.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {poses.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No poses found matching your criteria</p>
//         </div>
//       ) : (
//         <div className={`grid grid-cols-1 ${expandedPoseId === null ? 'md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}`}>
//           {poses.map((pose, index) => (
//             <div 
//               key={pose._id} 
//               className={`transition-all duration-300 ${
//                 expandedPoseId !== null && expandedPoseId !== index ? 'opacity-0 h-0 overflow-hidden' : ''
//               }`}
//             >
//               <PoseCard
//                 name={pose.name}
//                 image={pose.image}
//                 description={pose.description}
//                 steps={pose.steps}
//                 video={pose.video}
//                 isExpanded={expandedPoseId === index}
//                 onClick={() => togglePoseExpansion(index)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Flexibility;






















// function Flexibility() {
//   const [selectedLevel, setSelectedLevel] = useState("basic");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedPoseId, setExpandedPoseId] = useState(null);

//   const filteredPoses = poses.filter((pose) => {
//     const matchesLevel = pose.level === selectedLevel;
//     const matchesSearch = pose.name.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesLevel && matchesSearch;
//   });

//   const togglePoseExpansion = (index) => {
//     setExpandedPoseId(expandedPoseId === index ? null : index);
//   };

//   return (
//     <div className={`min-h-screen p-6 ${expandedPoseId !== null ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
//       <div className={`max-w-6xl mx-auto ${expandedPoseId !== null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
//         {/* Header and controls (hidden when pose expanded) */}
//         <h1 className="text-4xl font-bold text-center mb-6 text-indigo-800">Yoga Flexibility Poses</h1>
        
//         <div className="mb-8">
//           <div className="relative max-w-md mx-auto">
//             <input
//               type="text"
//               placeholder="Search poses..."
//               className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <svg className="absolute right-3 top-3.5 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//         </div>

//         <div className="flex justify-center space-x-4 mb-8">
//           {["basic", "intermediate", "advanced"].map((level) => (
//             <button
//               key={level}
//               className={`px-6 py-2 rounded-full font-medium transition-all ${
//                 selectedLevel === level
//                   ? "bg-indigo-600 text-white shadow-md"
//                   : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
//               }`}
//               onClick={() => setSelectedLevel(level)}
//             >
//               {level.charAt(0).toUpperCase() + level.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Pose Cards Grid */}
//       {filteredPoses.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No poses found matching your criteria</p>
//         </div>
//       ) : (
//         <div className={`grid grid-cols-1 ${expandedPoseId === null ? 'md:grid-cols-2 lg:grid-cols-3 gap-8' : ''}`}>
//           {filteredPoses.map((pose, index) => (
//             <div 
//               key={index} 
//               className={`transition-all duration-300 ${
//                 expandedPoseId !== null && expandedPoseId !== index ? 'opacity-0 h-0 overflow-hidden' : ''
//               }`}
//             >
//               <PoseCard
//                 name={pose.name}
//                 image={pose.image}
//                 description={pose.description}
//                 steps={pose.steps}
//                 video={pose.video}
//                 isExpanded={expandedPoseId === index}
//                 onClick={() => togglePoseExpansion(index)}
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Flexibility;