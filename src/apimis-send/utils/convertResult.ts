const convertResult = (status: 'success' | 'error', message: string, data?: any) => {
  return {
    status: status,
    message: message,
    data: data,
  };
};

export default convertResult;
