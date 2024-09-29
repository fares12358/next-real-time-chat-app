'use client'
import React, { useState, useEffect } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGE } from './writeappConfig';
import { ID } from 'appwrite';
import Msg from './Msg';
import { useAuth } from '@/Context/AuthContext';

const Room = () => {
  const { data, setData } = useAuth();
  const [messageBody, setMessageBody] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // Function to fetch messages from the database
  const getData = async () => {
    try {
      setLoading(true)
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGE);
      setData(response.documents); // Assuming response.documents is the array of messages
      console.log(response.documents);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getData();
    client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGE}.documents`, response => {
      console.log('the realTime is',response);
      if(response.events.includes("databases.*.collections.*.documents.*.create" )){
        console.log('A Message was created');
      }
      if(response.events.includes("databases.*.collections.*.documents.*.delete" )){
        const deletedId= response.payload.$id;
        console.log('A Message was deleted',deletedId);
        setData(data.filter((msg:any) => msg.$id !== deletedId));
      }

    })
  }, []); // Fetch messages on component mount

  // Function to handle sending new messages
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageBody.trim()) return; // Prevent sending empty messages

    let payload = {
      body: messageBody,
    };

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGE,
        ID.unique(),
        payload
      );
      setData([...data, response]); // Update data with new message
      setMessageBody(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='border border-myBorder m-5 p-5 rounded-xl text-white'>
      <div className="flex justify-center gap-5 items-center p-5">
        <textarea
          name="message"
          id="message"
          className='bg-transparent border-none outline-none focus:outline-none p-5 rounded-xl shadow-inset-custom'
          required
          maxLength={1000}
          placeholder='Say Something . . .'
          rows={4}
          cols={60}
          onChange={(e) => setMessageBody(e.target.value)}
          value={messageBody}
        ></textarea>
        <div>
          <button
            className='bg-myBtnBg hover:opacity-[0.5]  text-xl text-white px-4 py-2 rounded-md'
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      <div className='bg-myBg2 flex flex-col gap-5 h-[70vh] p-5 border border-myBorder rounded-xl overflow-auto scrollbar-custom'>
        {!loading ?
          (data.length > 0) ? (
            data.map((item: any) => (
              <Msg key={item.$id} id={item.$id} body={item.body} time={new Date(item.$createdAt).toLocaleString()} />
            ))
          ) : (
            <p className='bg-myBtnBg2 px-5 py-2 w-fit rounded-md '>No messages available</p>
          )
          :
          <div className="animate-pulse w-full h-full flex items-center justify-center">
            <h1 className="bg-myBtnBg2 w-fit px-5 py-2 flex items-center justify-center rounded-md">loading . . .</h1>
          </div>
        }
      </div>
    </div >
  );
};

export default Room;
