const PoseCard = ({ name, image, level, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-60 w-full flex items-center justify-center bg-gray-200">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-500 capitalize">{level}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default PoseCard;
