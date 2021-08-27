import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChartComponent } from '../components/ChartComponent';

export const PollScore = () => {
    const [polls, setPolls] = useState([]);
    const [pollScore, setPollScore] = useState([]);
    const [pollQuestions, setPollQuestions] = useState([]);

    useEffect(async () => {
        await getPolls();
        await getPollScores();
        await getPollQuestions();
    }, []);

    async function getPolls() {
        try {
            const response = await axios.get('http://localhost:3001/poll');
            setPolls(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    async function getPollQuestions() {
        try {
            const response = await axios.get(`http://localhost:3001/poll_questions`);
            setPollQuestions(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    async function getPollScores() {
        try {
            const response = await axios.get('http://localhost:3001/poll_score');
            setPollScore(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {polls ?
                <>
                    {polls.map(c => {
                        return (
                            <div key={`poll_score_${c.id}`}>
                                <div>{c.name}</div>
                                {pollQuestions &&
                                    <div>
                                        {pollQuestions.sort(function (a, b) { return a.sort - b.sort }).map(d => {
                                            const model = []

                                            d.answers.map(f => {
                                                let temp = pollScore.find(s => s.poll_question_id === d.id);
                                                if (temp) {
                                                    model.push({
                                                        category: f.name,
                                                        data: (temp.scores.find(s => s.answer_id === f.id).value / temp.scores.map(c => c.value).reduce((a, b) => a + b, 0) * 100).toFixed(2)
                                                    })
                                                }
                                            })

                                            return (
                                                <div key={`poll_question_score_${d.id}`}>
                                                    <div>
                                                        {d.sort}. {d.question}
                                                    </div>

                                                    <ChartComponent model={model} />

                                                    <table>
                                                        <tr>
                                                            <th>OPCIJE</th>
                                                            <th>ODGOVORI</th>
                                                            <th></th>
                                                        </tr>
                                                        {d.answers.sort(function (a, b) { return a.sort - b.sort }).map(x => {
                                                            let temp = pollScore.find(s => s.poll_question_id === d.id);

                                                            return (
                                                                <tr key={`score_poll_question_${d.id}_${x.id}`}>
                                                                    <td>{x.name}</td>
                                                                    <td>{temp ? `${(temp.scores.find(s => s.answer_id === x.id).value / temp.scores.map(c => c.value).reduce((a, b) => a + b, 0) * 100).toFixed(2)}%` : '0%'}</td>
                                                                    <td>{temp ? temp.scores.find(s => s.answer_id === x.id).value : 0}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </table>

                                                </div>
                                            )
                                        })
                                        }
                                    </div>}
                            </div>
                        )
                    })}
                </>
                :
                <div>Nema anketa</div>
            }
        </>
    )
}