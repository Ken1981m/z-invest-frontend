// @ts-nocheck
import React, { useState } from 'react';
import '../styles/modal.scss';
import ChevronIcon from './ChevronIcon';

const UtgiftModal = ({ isOpen, onClose, utgiftData, aar }) => {

  const [expandedRow, setExpandedRow] = useState(null);
  const [expanded, setExpanded] = useState(false);

  function toggleClose() {
    setExpandedRow(null);
    setExpanded(false);
    onClose();
  }

  const toggleRow = (rowIndex) => {
       setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
       setExpanded(expandedRow !== rowIndex);
  };

  if (!isOpen) return null; // Don't render the modal if it isn't open

  return (
    <div id="modal-presentation">
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Utgifter for {aar} (føres i skattemelding)</h3>
                <button onClick={() => toggleClose()} className="modal-close button">
                &times;
                </button>
               

                {Object.keys(utgiftData).length > 0 ? (
                    Object.keys(utgiftData).map((leilighet, leilighetIndex) => (
                      <table className="striped-table" key={`table-${leilighetIndex}`}>
                        <tbody>
                          <tr key={`leilighet-${leilighetIndex}`}>
                            <td key={`leilighet-${leilighetIndex}-1`}><b>{leilighet}</b></td>
                            <td key={`leilighet-${leilighetIndex}-2`}/>
                            <td key={`leilighet-${leilighetIndex}-3`}/>
                          </tr>

                          {utgiftData[leilighet].map((item, index) => {
                            const uniqueRowId = leilighetIndex * 1000 + index;

                            return (
                              <>
                                <tr key={uniqueRowId}
                                  className="expandable-row"
                                  onClick={() => toggleRow(uniqueRowId)}
                                >
                                  <td key={`item-${uniqueRowId}-1`}>{item.label}</td>
                                  <td key={`item-${uniqueRowId}-2`}>{item.belop}</td>
                                  <td key={`item-${uniqueRowId}-3`}>
                                    <ChevronIcon expanded={expandedRow === uniqueRowId} />
                                  </td>
                                </tr>

                                {expandedRow === uniqueRowId &&
                                  item.utgiftDetaljer.map((detalj, detaljIndex) => (
                                    <tr key={`detalj-${uniqueRowId}-${detaljIndex}`}>
                                      <td key={`detalj-${uniqueRowId}-${detaljIndex}-1`}>
                                        {detalj.navn}
                                      </td>
                                      <td key={`detalj-${uniqueRowId}-${detaljIndex}-2`}>
                                        {detalj.belop}
                                      </td>
                                      <td key={`detalj-${uniqueRowId}-${detaljIndex}-3`} />
                                    </tr>
                                  ))}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    ))
                  ) : (
                    <p/>
                  )}
                
            </div>
        </div>
    </div>
  );
}

export default UtgiftModal;