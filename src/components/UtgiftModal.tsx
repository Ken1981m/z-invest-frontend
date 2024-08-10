import React, { useState } from 'react';
import '../styles/modal.scss';


const UtgiftModal = ({ isOpen, onClose, utgiftData, aar }) => {

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (rowIndex) => {
       setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  if (!isOpen) return null; // Don't render the modal if it isn't open

  return (
    <div id="modal-presentation">
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Utgifter for {aar}</h4>
                <button onClick={onClose} className="modal-close button">
                &times;
                </button>

                {utgiftData.length > 0 ? (

                    <table className="striped-table">
                      <tbody>
                        {utgiftData.map((item, index) => (
                          <>
                          <tr key={index} className="expandable-row" onClick={() => toggleRow(index)}>
                            <td key={index+1}>{item.label}</td>
                            <td key={index+2}>{item.belop}</td>
                          </tr>
                          
                          {expandedRow === index && (
                              item.utgiftDetaljer.map((detalj, detaljIndex) => (
                                  <tr key={detaljIndex}>
                                      <td key={detaljIndex+1}>{detalj.navn}</td>
                                      <td key={detaljIndex+2}>{detalj.belop}</td>
                                  </tr>
                              ))
                          )}  
                        </>
                        ))} 
                    </tbody>
                    </table>
                  )
                  : <p/>
                }
                
            </div>
        </div>
    </div>
  );
}

export default UtgiftModal;