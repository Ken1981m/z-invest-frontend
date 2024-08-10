// @ts-nocheck
import React, { useState } from 'react';
import '../styles/modal.scss';
import ChevronIcon from './ChevronIcon';


const UtgiftModal = ({ isOpen, onClose, utgiftData, aar }) => {

  const [expandedRow, setExpandedRow] = useState(null);

  function toggleClose() {
    setExpandedRow(null);
    onClose();
  }

  const toggleRow = (rowIndex) => {
       setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  if (!isOpen) return null; // Don't render the modal if it isn't open

  return (
    <div id="modal-presentation">
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Utgifter for {aar}</h4>
                <button onClick={() => toggleClose()} className="modal-close button">
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
                            <td><ChevronIcon/></td>
                          </tr>
                          
                          {expandedRow === index && (
                              item.utgiftDetaljer.map((detalj, detaljIndex) => (
                                  <tr key={detaljIndex}>
                                      <td key={detaljIndex+1}>{detalj.navn}</td>
                                      <td key={detaljIndex+2}>{detalj.belop}</td>
                                      <td/>
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