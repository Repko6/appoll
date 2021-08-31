import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';


export const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(async () => {
    await getPolls();
  }, []);

  async function getPolls() {
    try {
      const response = await axios.get('http://localhost:3001/poll');
      setPolls(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  async function addNewPoll() {
    try {
      let data = {
        "id": nanoid(),
        "name": "Nova anketa"
      }

      await axios({
        method: 'post',
        url: `http://localhost:3001/poll`,
        data: data
      });

      let data2 = {
        "id": nanoid(),
        "name": "Nova anketa"
      }

      getPolls();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {polls.map(c => {
        return (
          <>
            <Link key={`poll_list_${c.id}`} to={`/edit/${c.id}`}>{c.name}</Link>
            <br />
          </>
        )
      })}
      <br />
      <button onClick={addNewPoll}>Dodaj novu anketu</button>
    </>
  )
}