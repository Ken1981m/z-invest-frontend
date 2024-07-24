// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";

export function Back() {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate("/");
    }

    return (
        <div className="padded-bottom">
            <button onClick={handleNavigateBack}>Tilbake</button>
        </div>    

    )

}