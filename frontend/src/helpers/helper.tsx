export const mapOptions = (items:[], idKey:any, nameKey:any) =>
    items.map(item => ({ label: item[idKey], value: item[nameKey] }));

export const isAllSchoolsUser = (user: any) => String(user?.SCHOOL_ID ?? '') === '0';

export const filterSchoolsForUser = (schools: any[], user: any) => {
    if (isAllSchoolsUser(user)) {
        return schools;
    }

    return schools.filter((school: any) => String(school.SCHOOL_ID) === String(user?.SCHOOL_ID));
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // if (isNaN(date.getTime())) return ''; // Invalid date
    return date.toLocaleDateString('en-UK', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).replace(/\//g, '-'); // Replace slashes with dashes
}
