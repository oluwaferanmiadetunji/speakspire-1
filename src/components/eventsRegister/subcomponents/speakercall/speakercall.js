import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';

import bluePlusIcon from '../../assets/bluePlainPlus.svg';
import deleteSectionIcon from '../../assets/deletesection.svg';

import './speakercall.scss';

import '../../../../stylesheets/tag.scss';

import { SPEAKER_SPECIALITY, COUNTRY_LIST, SPEAKER_CATEGORY } from '../../component/constants';
import {
    TOPIC_AREAS
} from '../../../speakerRegister/subcomponents/expertise/constants';


export default function SpeakerCall({
    stateChanger, state
}) {

    const changeListData = ( index, subproperty,  value) =>{
        const updatedState = [...state];
        updatedState[index][subproperty] = value;
        stateChanger(updatedState);
    }
    const deleteSection = (index) => {
        stateChanger(
            [...state].filter((state,stateIndex)=>(
                stateIndex !== index
        )))
    }

    const saveSpeakercall = (event)=>{
        console.log(state);
    }

    const addNewCall = () => {
        stateChanger([
            ...state,
            {
                speakerCategory: '',
                topicArea: '',
                country: '',
                budgetFrom: '',
                budgetTo: '',
                eventDescription: '',
            }
        ])
    }


    return (
        <div className="speakercall">

            <div className="speakercall__heading">
                <div className="speakercall__heading__header">
                    Call For Speakers
                </div>

            </div>
            {
                state.map((speakercall, index)=>(
                    <div className="speakercall__formsection ">
                        {
                            (index === 0)
                                ||
                            <img
                                src={deleteSectionIcon}
                                alt=""
                                className="--delete"
                                onClick={()=>deleteSection(index)}
                            />
                        }
                        {/* wrapper for the selects */}
                        <div className="--wrapper">
                            
                            <label className="double" htmlFor="position">
                                Speaker Category
                            </label>
                            <div className="--singleselect">
                                <Select
                                    options={SPEAKER_CATEGORY}
                                    isSearchable
                                    placeholder="Select"
                                    className="--item"
                                    onChange={(value) => {
                                        changeListData(index, 'speakerCategory',  value)
                                    }}
                                    value={speakercall.speakerCategory}
                                />
                            </div>

                        </div>

                        <div className="--wrapper">
                            
                            <label className="double" htmlFor="position">
                                Topic Area
                            </label>
                            <div className="--singleselect">
                                <Select
                                    options={TOPIC_AREAS}
                                    isSearchable
                                    placeholder="Select"
                                    className="--item"
                                    onChange={(value) => changeListData(index, 'topicArea',  value)}
                                    value={speakercall.topicArea}
                                />
                            </div>

                        </div>

                        <div className="--wrapper">
                            
                            <label className="double" htmlFor="position">
                                Country
                            </label>
                            <div className="--singleselect">
                                <Select
                                    options={COUNTRY_LIST}
                                    isSearchable
                                    placeholder="Select"
                                    className="--item"
                                    onChange={(value) =>  changeListData(index, 'country',  value)}
                                    value={speakercall.country}
                                />
                            </div>

                        </div>

                        {/* wrapper for the selects */}

                        <div className="--wrapper">
                            
                            <label className="double" htmlFor="position">
                                Speaker Budget
                            </label>
                            <div className="--double_wrapper">
                                <input
                                    value={speakercall.budgetFrom}
                                    type="number"
                                    placeholder="00.00 NGN"
                                    onChange={(e) =>  changeListData(index, 'budgetFrom',  e.target.value)}
                                    min="1000"
                                />
                                <span>to</span>
                                <input
                                    placeholder="00.00 NGN "
                                    type="number"
                                    value={speakercall.budgetTo}
                                    onChange={(e) =>  changeListData(index, 'budgetTo',  e.target.value)}
                                    min="1000"
                                />
                            </div>

                        </div>

                        {/* wrapper for teh event desription */}
                        <div className="--wrapper">
                            <label className="double" htmlFor="fullbio">
                                Speaker Description
                            </label>
                            <textarea
                                name="eventDescription"
                                type="text"
                                placeholder="Tell us more about the kind of speakers you’re looking for..."
                                value={speakercall.eventDescription}
                                onChange={(e)=>{
                                    changeListData(index, 'eventDescription',  e.target.value)
                                }}
                            />
                        </div>
                        {/* wrapper for teh event desription */}

                    </div>

                ))
            }

            <div className="speakercall__footer">
                <div
                    className="--extra"
                    onClick={addNewCall}
                >
                    <div>
                        <img src={bluePlusIcon} alt=""/>
                        Add New Call For Speakers
                    </div>
                </div>
                <div className="--button_group">
                    <Link className="link" to="/">
                        <div className="cancel">
                            Cancel
                        </div>
                    </Link>

                    <Link onClick={saveSpeakercall} className="link" to="/registerevent/4">
                        <div className="next">
                            Save & Continue
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

SpeakerCall.propTypes = {
    stateChanger: PropTypes.func.isRequired,
    state: PropTypes.instanceOf(Object).isRequired
}