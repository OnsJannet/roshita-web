import DeleteButton from "../layout/DeleteButton";

interface CardProps {
  name: string;
  price: string;
  onDelete: () => void;
}

const TestCard: React.FC<CardProps> = ({ name, price, onDelete }) => {
  return (
    <div className="flex lg:flex-row-reverse flex-col lg:gap-0 gap-6 items-center justify-between border rounded-lg p-4 bg-white 
      rtl">
      <div className="flex  flex-row-reverse w-[60%]">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#71c9f9] rounded-full">
          <div className="w-8 h-8 bg-[url('/Images/labs.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        <div  className="flex-1 mr-4 flex items-center justify-between flex-row-reverse">
            {/* Text Section */}
            <div className=" mr-4">
            <div className="text-lg font-bold text-gray-800">{name}</div>
            </div>

            <div className=" mr-4">
            <div className="text-lg font-bold text-gray-800">{price}</div>
            </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <DeleteButton onConfirm={onDelete} />
      </div>
    </div>
  );
};

export default TestCard;
