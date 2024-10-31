import { useState, useEffect } from 'react';
import { MovieAvailability } from "@appTypes/provider/provider";
import ProviderInfo from "./ProviderInfo";
import useCountry from '@hooks/country/useCountry';

const ProvidersInfo = ({ providers }: { providers: MovieAvailability }) => {
  const { countries } = useCountry();
  const countryCodes = Object.keys(providers?.results || {});
  const defaultCountry = "US";
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem("selectedCountry") || defaultCountry;
  });

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", country);
  };

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.iso_3166_1 === code);
    return country ? country.english_name : code;
  };

  const provider = providers?.results[selectedCountry];
  const hasResults = Object.keys(providers.results).length > 0;
  if (!hasResults) return <></>;
  return (
    <>
      <div className="mb-4">
        <label htmlFor="country-selector" className="font-semibold mr-4">Select Country:</label>
        <select
          id="country-selector"
          value={selectedCountry}
          onChange={handleCountryChange}
          className="border border-secondary p-2 rounded-lg outline-none w-full text-primary"
        >
          {countryCodes.map(code => (
            <option key={code} value={code} className="text-gray-700">
              {getCountryName(code)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-16 flex-wrap">
        <ProviderInfo label='stream' providers={provider?.flatrate || []} />
        <ProviderInfo label='rent' providers={provider?.rent || []} />
        <ProviderInfo label='buy' providers={provider?.buy || []} />
      </div>
    </>
  );
};

export default ProvidersInfo;
