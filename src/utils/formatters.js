export const formatCurrency = (amount, currencyCode = 'USD', symbol = '$', rate = 1.0) => {
  const convertedAmount = amount * rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(convertedAmount).replace(/[A-Z]{3}/, symbol); // Replace code with symbol if needed or use Intl properly
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
