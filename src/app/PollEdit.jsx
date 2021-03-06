import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { InputLabelComponent } from '../components/InputLabelComponent';
import Toggle from 'react-toggle';
import addIcon from '../icons/addIcon.png'
import removeIcon from '../icons/removeIcon.svg'
import { nanoid } from 'nanoid';

export const PollEdit = ({ match, onChangePollName }) => {
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
      setPoll(response.data);
      onChangePollName(response.data.name)
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

      onChangePollName(event.target.value);
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
    const newId = nanoid();
    const newSort = pollQuestions.length ? pollQuestions.sort(function (a, b) { return a.id - b.id })[pollQuestions.length - 1].sort + 1 : 1;
    let data = [...pollQuestions, { id: newId, poll_id: pollId, sort: newSort, question: `Pitanje ${newSort}`, answers: [] }]

    setPollQuestions(data);

    await axios({
      method: 'post',
      url: `http://localhost:3001/poll_questions`,
      data: data.find(c => c.id === newId)
    });

    setOrder(newSort);
  }

  async function addAnswer(pollQuestionId) {
    const newId = nanoid();
    const newSort = pollQuestions.length ? (pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.sort - b.sort })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].sort + 1 : 1) : 1;
    let hasOtherAnswer = pollQuestions.find(c => c.id === pollQuestionId).answers.some(d => d.name === 'Drugo');

    let data = pollQuestions.map(item =>
      item.id === pollQuestionId
        ? { ...item, answers: [...item.answers.map(item2 => item2.name === 'Drugo' ? { ...item2, sort: newSort } : item2), { id: newId, sort: hasOtherAnswer ? newSort - 1 : newSort, name: `Odgovor ${newSort}` }] }
        : item);

    setPollQuestions(data);

    await axios({
      method: 'put',
      url: `http://localhost:3001/poll_questions/${pollQuestionId}`,
      data: data.find(c => c.id === pollQuestionId)
    });
  }

  async function addAnswerOther(pollQuestionId) {
    const newId = nanoid();
    const newSort = pollQuestions.length ? (pollQuestions.find(c => c.id === pollQuestionId).answers.length ? pollQuestions.find(c => c.id === pollQuestionId).answers.sort(function (a, b) { return a.sort - b.sort })[pollQuestions.find(c => c.id === pollQuestionId).answers.length - 1].sort + 1 : 1) : 1;

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
          <section className="pollEditTitle">
            <InputLabelComponent value={poll.name} changeEvent={changePollName} editMode={editMode} changeEditMode={changeEditMode} classNameInput="classNameInputPollEdit" classNameLabel="pointer"/>
          </section>

          {pollQuestions &&
            <section className="pollEditQuestions">
              {pollQuestions.sort(function (a, b) { return a.sort - b.sort }).map(c => {
                return (
                  <div key={`poll_question_${c.id}`}>
                    {c.sort === order &&
                      <div key={`poll_question_${c.id}`}>
                        <div className="pollEditQuestions-question">
                          <span className="pollEditQuestions-question-number">{c.sort}.</span> <InputLabelComponent value={c.question} changeEvent={(event, save) => changePollQuestionName(event, save, c.id)} editMode={editMode} changeEditMode={changeEditMode}  classNameLabel="pointer" />
                        </div>
                        <div className="pollEditQuestions-answers">
                          {c.multi_answer ?
                            <div>
                              {c.answers.sort(function (a, b) { return a.sort - b.sort }).map(d =>
                                <div key={`answer_${d.id}`} className="pollEditQuestions-answers-answer">
                                  <input type="checkbox" value={false} className="pollEditQuestions-answers-answer-checkbox" />
                                  <InputLabelComponent value={d.name} changeEvent={(event, save) => changePollQuestionAnswer(event, save, c.id, d.id)} editMode={editMode} changeEditMode={changeEditMode} classNameInput="classNameInput"  classNameLabel="pointer" />
                                  {editMode && <img src={removeIcon} className="removeIconImg" onClick={() => removeAnswer(c.id, d.id)} ></img>}
                                  {d.name === 'Drugo' && <div><textarea value='' className="textareaComment" onChange={() => { }} placeholder="Molimo upi??ite komentar." /></div>}
                                </div>)}
                            </div>
                            :
                            <div>
                              {c.answers.sort(function (a, b) { return a.sort - b.sort }).map(d =>
                                <div key={`answer_${d.id}`} className="pollEditQuestions-answers-answer">
                                  <input type="radio" name={`radio_poll_question_${c.id}`} value={d.id} className="pollEditQuestions-answers-answer-radio" />
                                  <InputLabelComponent value={d.name} changeEvent={(event, save) => changePollQuestionAnswer(event, save, c.id, d.id)} editMode={editMode} changeEditMode={changeEditMode} classNameInput="classNameInput" classNameLabel="pointer" />
                                  {editMode && <img src={removeIcon} onClick={() => removeAnswer(c.id, d.id)} ></img>}
                                  {d.name === 'Drugo' && <div><textarea value='' className="textareaComment" onChange={() => { }} placeholder="Molimo upi??ite komentar." /></div>}
                                </div>)}
                            </div>
                          }
                        </div>

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
                              <label htmlFor='multi_answer'>Vi??estruki odabir</label>
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

            </section>}

          {!editMode && <button onClick={() => addQuestion(poll.id)} className="btn-icon" ><img src={addIcon} className="addIconButton"/>Dodaj pitanje</button>}

          {pollQuestions &&
            <div className="pollEditNextPreviousQuestion">
              <button onClick={() => setOrder(order + 1)} disabled={!pollQuestions.some(c => c.sort == order + 1)} className="btn-paging margin-right">Sljede??e pitanje</button>
              <button onClick={() => setOrder(order - 1)} disabled={!pollQuestions.some(c => c.sort == order - 1)} className="btn-paging">Prethodno pitanje</button>
            </div>}
        </> :
        <>Anketa ne postoji</>
      }
    </>
  )
}