import { useState } from "react";

import { Workout } from "../../Models/Workout";
import { Exercise } from "../../Models/Exercise";
import ExerciseManager from "../../Managers/ExerciseManager";
import ExerciseSearch from "../Shared/ExerciseSearch";
import SetManager from "../../Managers/SetManager";

interface Props {
    existingWorkout: Workout | undefined,
    setShowExerciseSearch: (ShowExerciseSearch: boolean) => void,
    setExercises: (Exercises: Exercise[]) => void,
    setCompletedSets: (CompletedSets: {SetIndex: number, ExerciseIndex: number, Reps: number, Weight: number}[]) => void,
}

const WorkoutTable = (props: Props) => {
    const [ exercises, setExercises ] = useState<Exercise[]>([]);
    const [ reps, setReps ] = useState<{SetIndex: number, Reps: number}[]>([]);
    const [ weights, setWeights ] = useState<{SetIndex: number, Weight: number}[]>([]);
    const [ completedSets, setCompletedSets ] = useState<{SetIndex: number, ExerciseIndex: number, Reps: number, Weight: number}[]>([]);
    const [ showExerciseSearch, setShowExerciseSearch ] = useState(false);
    const [ addSetLoading, setAddSetLoading ] = useState(false);

    const exerciseManager = ExerciseManager();
    const setManager = SetManager();

    const handleShowExerciseSearch = (ShowExerciseSearch: boolean) => {
        setShowExerciseSearch(ShowExerciseSearch);
        props.setShowExerciseSearch(ShowExerciseSearch);
    }

    const handleMarkSetCompleted = (checked: boolean, SetIndex: number, ExerciseIndex: number) => {
        console.log(checked, SetIndex, ExerciseIndex);
        console.log("weight value: ", weights[weights.findIndex(x => x.SetIndex === SetIndex)]);
        console.log("rep value: ", reps[reps.findIndex(x => x.SetIndex === SetIndex)]);

        let newCompletedSets = [];

        if(checked){
            newCompletedSets = [...completedSets, { SetIndex: SetIndex, ExerciseIndex: ExerciseIndex, Reps: reps[reps.findIndex(x => x.SetIndex === SetIndex)]?.Reps, Weight: weights[weights.findIndex(x => x.SetIndex === SetIndex)]?.Weight}];
        } else {
            let existingSets = completedSets;
            existingSets.splice(completedSets.findIndex(x => x.SetIndex === SetIndex), 1);
            newCompletedSets = existingSets;
        }

        setCompletedSets(newCompletedSets);
        props.setCompletedSets(newCompletedSets);
    }

    const handleAddExercise = async (exerciseToAdd: Exercise) => {
        exerciseToAdd.SetIDs = "0";
        const newExercises = [...exercises, exerciseToAdd];
        setExercises(newExercises);
        props.setExercises(newExercises);
        handleShowExerciseSearch(false);
    }

    const handleAddSet = async (exerciseIndex: number) => {
        const currentSetIDs = exercises[exerciseIndex].SetIDs;
        const newSetID = parseInt(currentSetIDs.charAt(currentSetIDs.length - 1)) + 1;
        const newSetIDs = currentSetIDs + ',' + newSetID;
        
        let newExercises = exercises;
        let updatedExercise = newExercises[exerciseIndex];
        updatedExercise.SetIDs = newSetIDs;
        setExercises(newExercises);
    }

    const handleSetReps = (SetIndex: number, Reps: number) => {
        const idx = reps.findIndex(x => x.SetIndex === SetIndex);
        console.log(SetIndex, Reps);
        if(idx === -1){
            const newReps = [...reps, {SetIndex: SetIndex, Reps: Reps}];
            setReps(newReps);
        } else {
            let newReps = reps;
            newReps[idx].Reps = Reps;
            setReps(newReps);
        }
     }
     
     const handleSetWeights = (SetIndex: number, Weight: number) => {
        const idx = weights.findIndex(x => x.SetIndex === SetIndex);
        console.log(SetIndex, Weight);
        if(idx === -1){
            const newWeights = [...weights, {SetIndex: SetIndex, Weight: Weight}];
            setWeights(newWeights);
        } else {
            let newWeights = weights;
            newWeights[idx].Weight = Weight;
            setWeights(newWeights);
        }
     }

    return (
        <>
            {showExerciseSearch && <ExerciseSearch setShowExerciseSearch={handleShowExerciseSearch} handleAddExercise={handleAddExercise} />}
            <div className="workout-table-header">
                <h3 className="exercise-column-header">Exercise</h3>
                <h3 className="exercise-column-header">Rep Goal</h3>
                <h3 className="exercise-column-header">Weight Goal</h3>
                <h3 className="exercise-column-header">Completed</h3>
            </div>
            {exercises.map((exercise,exerciseIndex) => (
                <div key={`exercise-${exerciseIndex}`} className="workout-table-row-container">
                    <div className="workout-table-row">
                        <div className="exercise-title-column">
                            <p className="exercise-title">{exercise.Title}</p>
                        </div>
                        <div className='exercise-sets-container'>
                            {exercise.SetIDs.split(',').map((set,setIndex) => (
                                <div key={`exercise-${exerciseIndex}-set-container-${setIndex}`} className='exercise-set-container'>
                                    <div className="exercise-column">
                                            <input key={`exercise-${exerciseIndex}-rep-input-${setIndex}`} type="number" className="exercise-number-input" placeholder={"12"} onChange={(e:any) => {handleSetReps(setIndex, parseInt(e.target.value))}}></input>
                                    </div>
                                    <div className="exercise-column">
                                            <input key={`exercise-${exerciseIndex}-weight-input-${setIndex}`} type="number" className="exercise-number-input" placeholder={"100"} onChange={(e:any) => {handleSetWeights(setIndex, parseInt(e.target.value))}}></input>
                                    </div>
                                    <div className="exercise-column">
                                            <input key={`exercise-${exerciseIndex}-copmleted-input-${setIndex}`} type="checkbox" className="exercise-checkbox-input" onClick={(e: any) => {handleMarkSetCompleted(e.target.checked, setIndex, exerciseIndex)}}></input> 
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="workout-table-add-set">
                        <button className="workout-table-add-set-button" disabled={addSetLoading} onClick={() => handleAddSet(exerciseIndex)}>+</button>
                    </div>
                </div>
            ))}
            <div className="add-exercise-button-container">
                <button className="add-exercise-button" onClick={() => handleShowExerciseSearch(true)}>Add Exercise</button>
            </div>
        </>
    );
}

export default WorkoutTable;