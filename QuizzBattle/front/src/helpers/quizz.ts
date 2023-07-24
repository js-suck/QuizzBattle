


const POINT_PER_SECONDS = 5;

/**
    Increase score base on the time left before the end of the question answer
*/
export const increaseScore = (time : number) => POINT_PER_SECONDS * time;
