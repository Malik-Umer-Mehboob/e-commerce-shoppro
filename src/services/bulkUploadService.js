import api from './api';

export const bulkUploadService = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/products/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  downloadTemplate: () => {
    const columns = 'name,price,stock,category,description,image';
    const sample = '"Sample Product",1000,50,"Electronics","A great product","https://placehold.co/600x400"';
    const csvContent = `${columns}\n${sample}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'shoppro_product_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
