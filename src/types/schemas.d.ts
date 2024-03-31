export interface Exercise {
    description: string
    duration: number
    date: string
}

export interface User {
    username: string
    log?: Exercise[]
}

export interface ExerciseResponse extends User, Exercise {

}