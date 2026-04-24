import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToComparison, removeFromComparison } from '../../store/comparisonSlice';
import { Columns } from 'lucide-react';

const CompareButton = ({ productId }) => {
  const dispatch = useDispatch();
  const comparisonItems = useSelector((state) => state.comparison.items);
  const isInComparison = comparisonItems.some(item => item.id === productId);

  const handleToggle = (e) => {
    e.preventDefault();
    if (isInComparison) {
      dispatch(removeFromComparison(productId));
    } else {
      dispatch(addToComparison(productId));
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all border ${
        isInComparison 
          ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
          : 'bg-white text-gray-500 border-gray-100 hover:border-orange-500 hover:text-orange-500 shadow-sm'
      }`}
      title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      <Columns size={18} />
    </button>
  );
};

export default CompareButton;
