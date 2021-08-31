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
                                <div className="pollQuestionScoreTitle">{c.name}</div>
                                {pollQuestions &&
                                    <div>
                                        {pollQuestions.filter(x => x.poll_id === c.id).sort(function (a, b) { return a.sort - b.sort }).map(d => {
                                            const model = []

                                            d.answers.map(f => {
                                                let temp = pollScore.find(s => s.poll_question_id === d.id);
                                                if (temp) {
                                                    let tempAnswer = temp.scores.find(t => t.answer_id === f.id);
                                                    model.push({
                                                        category: f.name,
                                                        data: tempAnswer ? (tempAnswer.value / temp.scores.map(c => c.value).reduce((a, b) => a + b, 0) * 100).toFixed(2) : 0
                                                    })
                                                }
                                            })

                                            return (
                                                <div key={`poll_question_score_${d.id}`} className="poll_question">
                                                    <div className="pollQuestionScoreName">
                                                        {d.sort}. {d.question}
                                                    </div>

                                                    <div className="pollQuestionScoreChart">
                                                        <ChartComponent model={model} />
                                                    </div>

                                                    <table className="tableScore">
                                                        <th className="tableScore-heading">OPCIJE</th>
                                                        <th className="tableScore-heading">ODGOVORI</th>
                                                        <th className="tableScore-heading"></th>
                                                        {d.answers.sort(function (a, b) { return a.sort - b.sort }).map(x => {
                                                            let temp = pollScore.find(s => s.poll_question_id === d.id);

                                                            return (
                                                                <tr key={`score_poll_question_${d.id}_${x.id}`} className="tableScore-rows">
                                                                    <td>{x.name}</td>
                                                                    <td>{temp && temp.scores.find(s => s.answer_id === x.id) ? `${(temp.scores.find(s => s.answer_id === x.id).value / temp.scores.map(c => c.value).reduce((a, b) => a + b, 0) * 100).toFixed(2)}%` : '0%'}</td>
                                                                    <td>{temp && temp.scores.find(s => s.answer_id === x.id) ? temp.scores.find(s => s.answer_id === x.id).value : 0}</td>
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