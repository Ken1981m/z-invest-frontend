const fetchData = async (url) => {
  try {
      const response = await fetch(url);
      return response.json();
  } catch (error) {
      throw error;
  }
};

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

function getUrlWithParamData(paramData) {
   const searchParams = new URLSearchParams(paramData);
   const paramUrl = "?" + searchParams.toString();
   return paramUrl;
}

export { fetchData, postFormDataRequestOnUrl, getUrlWithParamData }