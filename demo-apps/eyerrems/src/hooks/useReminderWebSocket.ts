import {useState} from 'react';
import type {Reminder} from '../lib/remindersApi';
export function useReminderWebSocket(){const [missedCount,setMissedCount]=useState(0);const notifications:Reminder[]=[];return {notifications,missedCount,setMissedCount,dismiss:(_id:number)=>{},dismissAll:()=>{},connected:false};}
export function playTaskSound(){}
