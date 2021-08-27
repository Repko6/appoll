import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


export const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(async () => {
    await getPolls();
  }, []);

  async function getPolls() {
    try {
      const response = await axios.get('http://localhost:3001/poll');
      console.log(response.data);
      setPolls(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {polls.map(c => {
        return (
            <Link key={`poll_list_${c.id}`} to={`/edit/${c.id}`}>{c.name}</Link>
        )
      })}
    </>
  )
}