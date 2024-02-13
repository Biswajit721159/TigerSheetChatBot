// import React, { useState, useEffect } from "react";
// import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
const ChatHeader = (props) => {

    // let [bodyColor, setbodyColor] = useState()
    // useEffect(() => {
    //     giveBodyColor(localStorage.getItem('bodyColor'))
    // }, [])


    // function giveBodyColor(color) {
    //     if (color === null || color === "Dark") {
    //         localStorage.setItem('bodyColor', 'Dark')
    //         setbodyColor('Light')
    //         document.body.style.backgroundColor = 'rgb(3, 0, 31)'
    //     } else if (color === "Light") {
    //         setbodyColor('Dark')
    //         localStorage.setItem('bodyColor', 'Light')
    //         document.body.style.backgroundColor = 'rgb(44, 62, 80)'
    //     }
    // }
    return (
        <>
            <h3 className="card-title">TigerSheet Chat</h3>
            <div className="card-tools">
                {/* {bodyColor === "Dark" ? <MdOutlineLightMode className="mr-2" size={'20px'} onClick={() => giveBodyColor('Dark')} /> : <MdDarkMode className="mr-2" size={'20px'} onClick={() => giveBodyColor('Light')} />} */}
                <span data-toggle="tooltip" title="3 New Messages" className="badge badge-light">{props.length}</span>
                {/* <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus"></i>
                </button> */}
                <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                </button>
            </div>
        </>
    )
}

export default ChatHeader