export const handleError = (error?: any) => {
  if (typeof jest == 'undefined') {
    if (error.response) {
      console.log('error.response', error.response);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('error.message', error.message);
    }
    if (error.config) {
      console.log('error.config', error.config);
    }
    !error.message && !error.response && !error.request && console.log('error', error);
  }
};
