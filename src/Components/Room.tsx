'use client';
import React, { useState, useEffect } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGE } from './writeappConfig';
import { ID } from 'appwrite';
import Msg from './Msg';
import { useAuth } from '@/Context/AuthContext';

const Room = () => {
  const { data, setData } = useAuth();
  const [messageBody, setMessageBody] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false); // New state to prevent multiple sends

  // Function to fetch messages from the database
  const getData = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGE);
      setData(response.documents); // Assuming response.documents is the array of messages
      console.log(response.documents);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    const unSubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGE}.documents`, response => {
      console.log('Real-time event:');

      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        console.log('A message was created');
        setData((prevData: any) => {
          const newMsg: any = response.payload;
          if (!prevData.some((msg: any) => msg.$id === newMsg.$id)) {
            return [...prevData, newMsg]; // Avoid duplicates
          }
          return prevData;
        });
      }

      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        const res: any = response;
        const deletedId: string = res.payload.$id;
        console.log('A message was deleted', deletedId);
        setData((prevData: any) => prevData.filter((msg: any) => msg.$id !== deletedId)); // Functional update to get the latest state
      }
    });

    return () => {
      unSubscribe();
    };
  }, []); // Fetch messages on component mount

  // Function to handle sending new messages
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageBody.trim() || isSending) return; // Prevent sending empty messages or multiple sends

    const payload = {
      body: messageBody,
    };

    setIsSending(true); // Prevent multiple sends

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGE,
        ID.unique(),
        payload
      );
      setData((prevData: any) => [...prevData, response]); // Update data with new message using functional update
      setMessageBody(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  return (
    <div className='border border-myBorder m-5 p-5 rounded-xl text-white h-full'>


      <div className='bg-myBg2 flex flex-col gap-5 h-[80vh] p-5 border border-myBorder rounded-xl overflow-auto scrollbar-custom'>
        {!loading ? (
          data.length > 0 ? (
            data.map((item: any) => (
              <>
              <Msg key={item.$id} sender={true} id={item.$id} body={item.body} time={new Date(item.$createdAt).toLocaleString()} />
              </>
            ))
          ) : (
            <p className='bg-myBtnBg2 px-5 py-2 w-fit rounded-md m-auto animate-pulse '>No messages available</p>
          )
        ) : (
          <div className="animate-pulse w-full h-full flex items-center justify-center">
            <h1 className="bg-myBtnBg2 w-fit px-5 py-2 flex items-center justify-center rounded-md">loading . . .</h1>
          </div>
        )}
      </div>


      <div className="flex justify-center gap-5 items-center p-5">
        <input
          type='text'
          name="message"
          id="message"
          className='w-[50%] h-[80px] bg-transparent border-none outline-none focus:outline-none p-5 pl-10 rounded-xl shadow-inset-custom'
          required
          maxLength={1000}
          placeholder='Say Something . . .'
          onChange={(e) => setMessageBody(e.target.value)}
          value={messageBody}
        ></input>
        <div>
          <button
            className={`bg-myBtnBg ${(messageBody.length <= 0) ? `opacity-[0.4]` : ``}  text-xl text-white px-4 py-2 rounded-md ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSend}
            disabled={isSending} // Disable button while sending
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
