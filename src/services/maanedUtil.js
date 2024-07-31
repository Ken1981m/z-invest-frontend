const hentMaaned = (mndNr) => {
    const maaneder = [
        'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
    ];

    return maaneder[mndNr - 1] || 'Ugyldig mnd';
};

export { hentMaaned }