import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputLabelComponent } from '../components/InputLabelComponent';
import Toggle from 'react-toggle';

export const PollEdit = ({ match }) => {
  const { pollId } = match.params;

  const [order, setOrder] = useState(1);
  const [poll, setPoll] = useState(null);
  const [pollQuestions, setPollQuestions] = useState([]);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    async function fetchData() {
      await getPoll();
      await getPollQuestions();
    }
    fetchData()
  }, []);

  async function getPoll() {
    try {
      const response = await axios.get(`http://localhost:3001/poll/${pollId}`);
      setPoll(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  async function getPollQuestions() {
    try {
      const response = await axios.get(`http://localhost:3001/poll_questions?poll_id=${pollId}`);
      setPollQuestions(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  function changeEditMode(editMode) {
    setEditMode(editMode)
  }

  async function changePollName(event, save) {
    setPoll({ ...poll, name: event.target.value });
    if (save) {
      await axios({
        method: 'put',
        url: `http://localhost:3001/poll/${pollId}`,
        data: poll
      });
    }
  }

  async function changePollQuestionName(event, save, pollQuestionId) {
    let data = pollQuestions.map(item =>
      item.id === pollQuestionId
        ? { ...item, question: event.target.value }
        : item)
    setPollQuestions(data);
    if (save) {
      await axios({
        method: 'put',
        url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
        data: data.find(c => c.id === pollQuestionId)
      });
    }
  }

  async function changePollQuestionAnswer(event, save, pollQuestionId, pollQuestionAnswerId) {
    let data = pollQuestions.map(item =>
      item.id == pollQuestionId
        ? { ...item, answers: item.answers.map(item2 => item2.id === pollQuestionAnswerId ? { ...item2, name: event.target.value } : item2) }
        : item)

    setPollQuestions(data);

    if (save) {
      await axios({
        method: 'put',
        url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
        data: data.find(c => c.id === pollQuestionId)
      });
    }
  }

  async function addQuestion(pollId) {
    const newId = pollQuestions.sort(function (a, b) { return a.id - b.id })[pollQuestions.length - 1].id + 1;
    const newSort = pollQuestions.filter(c => c.poll_id === pollId).sort(function (a, b) { return a.id - b.id })[pollQuestions.filter(c => c.poll_id === pollId).length - 1].sort + 1;
    let data = [...pollQuestions, {id: newId, poll_id: pollId, sort: newSort, question: `Pitanje ${newSort}`, answers: []}]

    setPollQuestions(data);

    await axios({
      method: 'post',
      url: `http://localhost:3001/poll_questions`,
      data: data.find(c => c.id === newId)
    });

    setOrder(newSort);
  }

  async function addAnswer(pollQuestionId) {
    const newSort = pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.sort - b.sort })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].sort + 1 : 1;
    const newId = pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.id - b.id })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].id + 1 : 1;
    let hasOtherAnswer = pollQuestions.find(c => c.id === pollQuestionId).answers.some(d => d.name === 'Drugo');

    let data = pollQuestions.map(item =>
      item.id === pollQuestionId
        ? { ...item, answers: [...item.answers.map(item2 => item2.name === 'Drugo' ? { ...item2, sort: newSort } : item2), { id: newId, sort: hasOtherAnswer ? newSort - 1 : newSort, name: `Odgovor ${newId}` }] }
        : item);

    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  async function addAnswerOther(pollQuestionId) {
    const newSort = pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.sort - b.sort })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].sort + 1 : 1;
    const newId = pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.id - b.id })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].id + 1 : 1;

    let data = pollQuestions.map(item =>
      item.id == pollQuestionId
        ? { ...item, answers: [...item.answers, { id: newId, sort: newSort, name: `Drugo` }] }
        : item);

    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  async function removeAnswer(pollQuestionId, answerId) {
    let data = pollQuestions.map(item =>
      item.id === pollQuestionId
        ? { ...item, answers: [...item.answers.filter(item2 => item2.id !== answerId)] }
        : item);

    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  async function changePollQuestionMultiAnswer(pollQuestionId) {
    let data = pollQuestions.map(item =>
      item.id === pollQuestionId
        ? { ...item, multi_answer: !item.multi_answer }
        : item);

    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  async function changePollQuestionRequiredAnswer(pollQuestionId, requiredAnswer) {
    let data = [];
    if (requiredAnswer) {
      data = pollQuestions.map(item =>
        item.id === pollQuestionId
          ? { ...item, required_answer: requiredAnswer, answers: [...item.answers.filter(item2 => item2.name !== 'Drugo')] }
          : item);
    }
    else {
      data = pollQuestions.map(item =>
        item.id === pollQuestionId
          ? { ...item, required_answer: requiredAnswer }
          : item);
    }
    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  return (
    <>
      {poll ?
        <>
          <InputLabelComponent value={poll.name} changeEvent={changePollName} editMode={editMode} changeEditMode={changeEditMode} />

          {pollQuestions &&
            <div>
              {pollQuestions.sort(function (a, b) { return a.sort - b.sort }).map(c => {
                return (
                  <div key={`poll_question_${c.id}`}>
                    {c.sort === order &&
                      <div key={`poll_question_${c.id}`}>
                        <div>
                          {c.sort}. <InputLabelComponent value={c.question} changeEvent={(event, save) => changePollQuestionName(event, save, c.id)} editMode={editMode} changeEditMode={changeEditMode} />
                        </div>
                        <div>
                          {c.multi_answer ?
                            <div>
                              {c.answers.sort(function (a, b) { return a.sort - b.sort }).map(d =>
                                <div key={`answer_${d.id}`}>
                                  <input type="checkbox" value={false} />
                                  <InputLabelComponent value={d.name} changeEvent={(event, save) => changePollQuestionAnswer(event, save, c.id, d.id)} editMode={editMode} changeEditMode={changeEditMode} />
                                  {editMode && <button onClick={() => removeAnswer(c.id, d.id)} >❌</button>}
                                  {d.name === 'Drugo' && <div><textarea value='' onChange={() => { }} placeholder="Molimo upišite komentar." /></div>}
                                </div>)}
                            </div>
                            :
                            <div>
                              {c.answers.sort(function (a, b) { return a.sort - b.sort }).map(d =>
                                <div key={`answer_${d.id}`}>
                                  <input type="radio" name={`radio_poll_question_${c.id}`} value={d.id} />
                                  <InputLabelComponent value={d.name} changeEvent={(event, save) => changePollQuestionAnswer(event, save, c.id, d.id)} editMode={editMode} changeEditMode={changeEditMode} />
                                  {editMode && <button onClick={() => removeAnswer(c.id, d.id)} >❌</button>}
                                  {d.name === 'Drugo' && <div><textarea value='' onChange={() => { }} placeholder="Molimo upišite komentar." /></div>}
                                </div>)}
                            </div>
                          }
                        </div>
                        {!editMode && <button onClick={() => addQuestion(c.poll_id)} >Dodaj pitanje</button>}

                        {editMode &&
                          <>
                            <div>
                              <button onClick={() => addAnswer(c.id)} >Dodaj odgovor</button>
                              <button onClick={() => addAnswerOther(c.id)} disabled={c.answers.some(d => d.name === 'Drugo') || c.required_answer} >Dodaj odgovor "Drugo"</button>
                            </div>

                            <div>
                              <Toggle
                                id='multi_answer'
                                defaultChecked={c.multi_answer}
                                onChange={() => changePollQuestionMultiAnswer(c.id)} />
                              <label htmlFor='multi_answer'>Višestruki odabir</label>
                            </div>
                            <div>
                              <Toggle
                                id='required_answer'
                                defaultChecked={c.required_answer}
                                onChange={() => changePollQuestionRequiredAnswer(c.id, !c.required_answer)} />
                              <label htmlFor='required_answer'>Obavezan odgovor</label>
                            </div>
                          </>}
                      </div>}
                  </div>
                )
              })}

              <button onClick={() => setOrder(order + 1)} disabled={!pollQuestions.some(c => c.sort == order + 1)}>Sljedeće pitanje</button>
              <button onClick={() => setOrder(order - 1)} disabled={!pollQuestions.some(c => c.sort == order - 1)}>Prethodno pitanje</button>
            </div>}
        </> :
        <>Anketa ne postoji</>
      }
    </>
  )
}