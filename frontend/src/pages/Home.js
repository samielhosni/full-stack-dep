import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const askQuestion = async () => {
        try {
            const res = await axios.post('http://localhost:5000/query', { prompt: question });
            setAnswer(res.data.response);
        } catch (err) {
            setAnswer('Error contacting AI');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Ask the AI Assistant</h2>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Ask something..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="btn btn-primary" onClick={askQuestion}>Ask</button>
            <div className="mt-3"><strong>Answer:</strong> {answer}</div>
        </div>
    );
};

export default Home;