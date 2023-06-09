import React, { useState } from 'react';
import { postJsonData } from './../utils/dataUtil.jsx';
function Leilighet() {

    const [formData, setFormData] = useState({
        navn: "",
        adresse: "",
        postNr: "",
        postSted: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonData = JSON.stringify(formData);
        // transfer jsonData to backend REST controller method
        postJsonData('/leggTilLeilighet', jsonData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>
                  <label>
                    Navn: <input type="text" name="navn" value={formData.navn} onChange={handleInputChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Adresse:
                    <input type="text" name="adresse" value={formData.adresse} onChange={handleInputChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Postnummer:
                    <input type="text" name="postNr" value={formData.postNr} onChange={handleInputChange} />
                  </label>
                </p>
                <p>
                  <label>
                    Poststed:
                    <input type="text" name="postSted" value={formData.postSted} onChange={handleInputChange} />
                  </label>
                </p>
                <p>
                  <button onClick={handleSubmit}>Lagre</button>
                </p>
            </form>
        </div>
    )

}

export default Leilighet;