
import React, { useState } from 'react';

const PoseCard = ({ 
  id,
  name, 
  image, 
  description, 
  steps, 
  video, 
  isExpanded, 
  onClick 
}) => {
  const [showVideo, setShowVideo] = useState(false);

  // Extract YouTube ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(video);

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isExpanded ? 
          'fixed inset-0 z-50 bg-white m-4' : 
          'hover:shadow-xl cursor-pointer h-full flex flex-col'
      }`}
      onClick={!isExpanded ? onClick : undefined}
    >
      {/* Close button for expanded view */}
      {isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowVideo(false);
            onClick();
          }}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {isExpanded ? (
        <div className="w-full h-full flex flex-col lg:flex-row">
          {/* Left Column - Pose Details */}
          <div className={`${showVideo ? 'hidden' : 'lg:w-1/2'} p-8 flex flex-col`}>
            <div className="flex-grow flex items-center justify-center mb-8">
              <img
                src={image}
                alt={name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">{name}</h2>
              <p className="text-2xl text-gray-600 mb-8">{description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(true);
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors text-xl"
              >
                Show Video Tutorial
              </button>
            </div>
          </div>

          {/* Video Section */}
          {showVideo && (
            <div className="w-full h-[60vh] bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={`${name} tutorial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideo(false);
                }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Hide Video
              </button>
            </div>
          )}

          {/* Right Column - Steps */}
          <div className={`${showVideo ? 'w-full' : 'lg:w-1/2'} bg-gray-50 p-8 overflow-y-auto`}>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6 text-center lg:text-left">Steps:</h3>
            <ul className="list-decimal pl-8 space-y-4 text-gray-600 text-xl">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Default Card View */}
          <div className="h-64 w-full flex items-center justify-center bg-gray-50 p-4">
            <img
              src={image}
              alt={name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
          <div className="p-5 flex-grow flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>
            <p className="text-gray-600 mb-4 flex-grow">{description}</p>
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {steps.length} steps
              </span>
              <button 
                onClick={onClick}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View Details →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PoseCard;

























// import React, { useState } from 'react';

// const PoseCard = ({ 
//   name, 
//   image, 
//   description, 
//   steps, 
//   video, 
//   isExpanded, 
//   onClick 
// }) => {
//   const [showVideo, setShowVideo] = useState(false);

//   // Extract YouTube ID from URL
//   const getYouTubeId = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const videoId = getYouTubeId(video);

//   return (
//     <div 
//       className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
//         isExpanded ? 
//           'fixed inset-0 z-50 bg-white' : 
//           'hover:shadow-xl cursor-pointer h-full flex flex-col'
//       }`}
//       onClick={!isExpanded ? onClick : undefined}
//     >
//       {/* Close button for expanded view */}
//       {isExpanded && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setShowVideo(false);
//             onClick();
//           }}
//           className="absolute top-4 right-4 bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300 transition-colors z-10"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       )}

//       {isExpanded ? (
//         <div className="w-full h-full flex flex-col lg:flex-row">
//           {/* Left Column - Pose Details */}
//           <div className={`${showVideo ? 'hidden' : 'lg:w-1/2'} p-8 flex flex-col`}>
//             <div className="flex-grow flex items-center justify-center mb-8">
//               <img
//                 src={image}
//                 alt={name}
//                 className="max-h-full max-w-full object-contain rounded-lg"
//               />
//             </div>
//             <div className="text-center">
//               <h2 className="text-4xl font-bold text-gray-800 mb-6">{name}</h2>
//               <p className="text-2xl text-gray-600 mb-8">{description}</p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowVideo(true);
//                 }}
//                 className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors text-xl"
//               >
//                 Show Video Tutorial
//               </button>
//             </div>
//           </div>

//           {/* Video Section - Full width when shown */}
//           {showVideo && (
//             <div className="w-full h-[60vh] bg-black relative">
//               <iframe
//                 src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
//                 title={`${name} tutorial`}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="absolute top-0 left-0 w-full h-full"
//               />
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowVideo(false);
//                 }}
//                 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 Hide Video
//               </button>
//             </div>
//           )}

//           {/* Right Column - Steps (always visible) */}
//           <div className={`${showVideo ? 'w-full' : 'lg:w-1/2'} bg-gray-50 p-8 overflow-y-auto`}>
//             <h3 className="text-3xl font-semibold text-gray-700 mb-6 text-center lg:text-left">Steps:</h3>
//             <ul className="list-decimal pl-8 space-y-4 text-gray-600 text-xl">
//               {steps.map((step, i) => (
//                 <li key={i}>{step}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Default Card View */}
//           <div className="h-64 w-full flex items-center justify-center bg-gray-50 p-4">
//             <img
//               src={image}
//               alt={name}
//               className="max-h-full max-w-full object-contain rounded-lg"
//             />
//           </div>
//           <div className="p-5 flex-grow flex flex-col">
//             <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>
//             <p className="text-gray-600 mb-4 flex-grow">{description}</p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PoseCard;