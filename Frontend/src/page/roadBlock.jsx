import React from 'react';
import { useNavigate } from 'react-router-dom';

const Box = ({ title, content}) => {
    const navigate = useNavigate();

    const handleClick = ()=>{
        navigate(`/tubetweet/${title}`)
    }

    return (
        <div onClick={handleClick} className="p-2 sm:p-3 md:p-4">
            <div className="bg-gray-900 p-4 sm:p-5 md:p-6 rounded-lg shadow-lg transition-all duration-500 ease-in-out border border-cyan-500 hover:border-cyan-400 hover:scale-105 hover:bg-gray-800 max-w-full overflow-hidden">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-400 truncate">{title}</h3>
                <p className="text-sm sm:text-base text-green-300 line-clamp-2">{content}</p>
            </div>
        </div>
    );
};

export default Box;