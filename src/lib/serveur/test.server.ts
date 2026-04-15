export async function getCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3');
        const data = await response.json();
        return { countries: data };
    } catch (error) {
        console.error('Error fetching countries:', error);
        return { countries: [] };
    }
}