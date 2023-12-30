import React, { useState } from 'react';
import axios from 'axios'
import Example from '../components/Navbar';

const bloomLevels = {
  Remembering: ['recall', 'define', 'list', 'memorize'],
  Understanding: ['comprehend', 'explain', 'interpret', 'summarize'],
  Applying: ['apply', 'solve', 'use'],
  Analyzing: ['analyze', 'compare', 'contrast', 'identify'],
  Evaluating: ['evaluate', 'judge', 'assess'],
  Creating: ['create', 'generate', 'design'],
};

function determineBloomsLevel(outcomeDescription) {
  const outcomeWords = outcomeDescription.split(/\s+/);
  const bloomCount = {};

  for (const level in bloomLevels) {
    bloomCount[level] = 0;
  }

  for (const word of outcomeWords) {
    for (const level in bloomLevels) {
      const keywords = bloomLevels[level];
      if (keywords.some(keyword => word.toLowerCase().includes(keyword))) {
        bloomCount[level]++;
      }
    }
  }

  let maxLevel = 'Remembering';
  for (const level in bloomCount) {
    if (bloomCount[level] > bloomCount[maxLevel]) {
      maxLevel = level;
    }
  }

  return maxLevel;
}

function BloomTaxonomyClassifier() {
  const [results, setResults] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [marks, setMarks] = useState('');
  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [bloomLevel, setBloomLevel] = useState('');
  const [outcomes, setOutcomes] = useState([]);
  const [levelCounts, setLevelCounts] = useState({
    Remembering: 1,
    Understanding: 2,
    Applying: 3,
    Analyzing: 4,
    Evaluating: 5,
    Creating: 6,
  }); 

  const handleDescriptionChange = (e) => {
    setOutcomeDescription(e.target.value);
  };

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const handleClassification = () => {
    const level = determineBloomsLevel(outcomeDescription);
    setBloomLevel(level);
    setOutcomes([...outcomes, { description: outcomeDescription, level }]);
    setOutcomeDescription('');

    const result = levelCounts[level] * parseInt(marks, 10);
    setResults([...results, result]);
  
    const newTotalSum = totalSum + result;
    setTotalSum(newTotalSum);
  
    setResults([...results, result]);
    setTotalMarks((prevTotalMarks) => prevTotalMarks + parseInt(marks, 10));

  };

  const handleSubmitButton = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/blooms',{totalMarks,totalSum});
      setOutcomes([...outcomes, response.data]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <Example/>
    <div className="container mx-auto p-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Bloom's Taxonomy Classifier</h1>
      <form onSubmit={handleSubmitButton} className="space-y-4">
        <input
          type="text"
          placeholder="Enter the course or project outcome description..."
          value={outcomeDescription}
          onChange={handleDescriptionChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
         <input
          type="number"
          placeholder="Enter the marks for this outcome..."
          value={marks}
          onChange={handleMarksChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleClassification}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Classify
        </button>
        <table className="w-full border-2">
          <thead>
            <tr>
              <th className="border">Outcome Description</th>
              <th className="border">Taxonomy Level</th>
              <th className="border">Result (Level * Marks)</th>
            </tr>
          </thead>
          <tbody>
            {outcomes.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{item.description}</td>
                <td className={`border p-2 ${item.level.toLowerCase()}`}>
                  {item.level}
                </td>
                <td className="border p-2">{results[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Check
        </button>
      </form>
    </div>
    </>
  );
}

export default BloomTaxonomyClassifier;
