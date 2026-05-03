export const formatCurrency = (amount, currencyCode = 'PKR', symbol = 'Rs.', rate = 1.0) => {
  const convertedAmount = amount * rate;
  return symbol + ' ' + Number(convertedAmount).toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
