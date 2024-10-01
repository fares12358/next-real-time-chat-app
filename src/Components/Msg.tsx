import { msgProps } from '@/Types'
import Image from 'next/image'
import React, { useState } from 'react'
import { COLLECTION_ID_MESSAGE, DATABASE_ID, databases } from './writeappConfig'
import { useAuth } from '@/Context/AuthContext'

const Msg = ({ id, body, time, sender }: msgProps) => {
  const { data, setData} = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple delete actions if already in progress

    try {
      setIsDeleting(true);
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGE, id);
      // setData(data.filter((msg: any) => msg.$id !== id)); // Use $id instead of id
    } catch (error) {
      console.error('Failed to delete the message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`flex flex-col relative p-4 rounded-md ${(sender)? `bg-myBtnBg`: `bg-[#7b1135] self-end `} h-auto w-[350px] ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex justify-end items-center gap-5">
        <span className='text-sm text-myBtnTst font-bold'>{time}</span>
        <Image
          src="/icons8-delete.svg"
          width={20}
          height={20}
          className={`cursor-pointer ${isDeleting ? 'pointer-events-none' : ''}`}
          alt='delete'
          onClick={handleDelete}
        />
      </div>
      <span className='text-2xl font-bold'>{body}</span>
    </div>
  );
}

export default Msg;
