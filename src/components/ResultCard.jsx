// src/components/ResultCard.jsx
import React from "react";

const ResultCard = ({ data }) => {
  if (!data) return null;
  return (
    <div className="mt-6 p-4 bg-white rounded shadow border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ResultCard;
