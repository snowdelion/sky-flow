export const createSearchResultsParams = (
  lats: string,
  lons: string,
  temp: string,
) => {
  const params = new URLSearchParams({
    latitude: lats.toString(),
    longitude: lons.toString(),

    current: "temperature_2m,weather_code",

    temperature_unit: temp,
  });

  return params.toString();
};
