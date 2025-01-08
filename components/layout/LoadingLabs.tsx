import { helix  } from 'ldrs';

// Register the cardio component
helix.register()

// Usage of the <l-cardio> component with default values
const LoadingLabs = () => {
  return (
    <l-helix
        size="45"
        speed="2.5" 
        color="#1587c8" 
        ></l-helix>
  );
};

export default LoadingLabs;
