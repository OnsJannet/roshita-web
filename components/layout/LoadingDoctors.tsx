import { cardio } from 'ldrs';

// Register the cardio component
cardio.register();

// Usage of the <l-cardio> component with default values
const LoadingDoctors = () => {
  return (
    <l-cardio
      size="50"
      stroke="4"
      speed="2"
      color="#1587c8"
    ></l-cardio>
  );
};

export default LoadingDoctors;
