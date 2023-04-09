import OneSignal from "react-native-onesignal";

import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';

type TagUserInfoCreateParams = {
    email: string
    name: string
}

export function tagUserInfoCreate({email, name}:TagUserInfoCreateParams){
    OneSignal.sendTags({
        'user_name': name,
        'user_email': email
    })
}

export function tagLastExerciseDateUpdate(){
    const currentDate = new Date()
    const currentTimestamp = currentDate.getTime()  
    OneSignal.sendTag('last_exercise_date', `${currentTimestamp.toLocaleString()}`)
}

export function tagExerciseCountUpdate(totalOfExercises:string){
    OneSignal.sendTag('completed_exercise_count', totalOfExercises)
}
