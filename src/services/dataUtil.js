const fetchData = async (url) => {
  try {
      const response = await fetch(url);
      return response.json();
  } catch (error) {
      throw error;
  }
};

function getUrlWithParamData(paramData) {
  const searchParams = new URLSearchParams(paramData);
  const paramUrl = "?" + searchParams.toString();
  return paramUrl;
}

const postFormDataRequestOnUrl = async (url, formData) =>  {
  try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      return response.json();
  } catch (error) {
      throw error;
  }
};

const postRequestOnUrl = async (url) =>  {
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      return response.json();
  } catch (error) {
      throw error;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${month}-${year}`;
}

function genererListeAvFraTilParams(fra, til) {
    const paramsListe = [];

    for (let i = fra; i <= til; i++) {
        paramsListe.push(i);
    }

    return paramsListe.join(';');
}



export { fetchData, getUrlWithParamData, postFormDataRequestOnUrl, postRequestOnUrl, formatDate, genererListeAvFraTilParams }