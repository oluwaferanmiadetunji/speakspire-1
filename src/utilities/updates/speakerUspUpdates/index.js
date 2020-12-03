import React, {useState, useEffect} from 'react';
import {message} from 'antd';

export default function Index({initialData, onClose}) {
    const [state, setState] = useState("");

    useEffect(() =>{
        setState(initialData.usp);
    }, [initialData])

    const saveBio = () =>{
        // logic to make API call to save bio
        onClose();
        message.success("Profile sucessfully updated!")
    }

    return (
        <div className="updates textareawrapper">
            
            <div className="updates__form">
                <div className="updates__form__header">
                    Why Choose Me?
                    <span>What makes you different from other speakers? (Max. 25 words)</span>
                </div>

                <div className="updates__form__textareacontent">
                    <textarea
                        name="why"
                        onChange = {
                            ({target}) => {
                                setState(target.value)
                            }
                        }
                        value={state}
                    >

                    </textarea>
                </div>
            </div>
            <div className="updates__action">
                <div
                    className="cancel"
                    onClick={onClose}
                >
                    Cancel
                </div>

                <div
                    className="save"
                    onClick={saveBio}
                >
                    Save
                </div>
            </div>

        </div>
    )
}
