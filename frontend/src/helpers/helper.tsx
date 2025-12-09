export const mapOptions = (items:[], idKey:any, nameKey:any) =>
    items.map(item => ({ label: item[idKey], value: item[nameKey] }));

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // if (isNaN(date.getTime())) return ''; // Invalid date
    return date.toLocaleDateString('en-UK', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).replace(/\//g, '-'); // Replace slashes with dashes
}
