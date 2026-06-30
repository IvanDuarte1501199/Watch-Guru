import { useState, useEffect } from 'react';
import { MovieAvailability } from "@appTypes/provider/provider";
import ProviderInfo from "./ProviderInfo";
import useCountry from '@hooks/country/useCountry';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';
import Select from 'react-select';

const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(12px)',
    borderColor: state.isFocused ? '#5fb3cd' : 'rgba(73, 131, 182, 0.2)',
    boxShadow: state.isFocused ? '0 0 0 1px #5fb3cd' : 'none',
    color: '#ffffff',
    '&:hover': {
      borderColor: '#5fb3cd',
    },
    borderRadius: '0.5rem',
    padding: '2px',
    borderWidth: '1px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#090530',
    border: '1px solid rgba(73, 131, 182, 0.15)',
    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
    borderRadius: '0.5rem',
    zIndex: 50,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? '#5fb3cd' 
      : state.isFocused 
        ? 'rgba(95, 179, 205, 0.15)' 
        : 'transparent',
    color: state.isSelected ? '#08042c' : '#ffffff',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#5fb3cd',
      color: '#08042c',
    },
    padding: '10px 14px',
    fontSize: '0.875rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#ffffff',
    fontSize: '0.875rem',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.875rem',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#5fb3cd',
    },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#ef4444',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }),
};

const ProvidersInfo = ({ providers }: { providers: MovieAvailability }) => {
  const { countries } = useCountry();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  const countryCodes = Object.keys(providers?.results || {});
  const defaultCountry = "US";
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return localStorage.getItem("selectedCountry") || defaultCountry;
  });

  const handleCountryChange = (selectedOption: any) => {
    if (selectedOption) {
      const country = selectedOption.value;
      setSelectedCountry(country);
      localStorage.setItem("selectedCountry", country);
    }
  };

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.iso_3166_1 === code);
    if (!country) return code;
    return currentLanguage === 'es' ? country.native_name : country.english_name;
  };

  const provider = providers?.results[selectedCountry];
  const hasResults = Object.keys(providers.results).length > 0;
  if (!hasResults) return <></>;

  const selectOptions = countryCodes.map(code => ({
    value: code,
    label: getCountryName(code)
  }));

  const selectValue = {
    value: selectedCountry,
    label: getCountryName(selectedCountry)
  };

  return (
    <>
      <div className="mb-6 max-w-xs">
        <label htmlFor="country-selector" className="block font-semibold mb-2 text-white text-sm">
          {t.selectCountry}
        </label>
        <Select
          id="country-selector"
          value={selectValue}
          options={selectOptions}
          onChange={handleCountryChange}
          isSearchable={true}
          styles={customSelectStyles}
          maxMenuHeight={160}
          noOptionsMessage={() => currentLanguage === 'es' ? "No hay opciones" : "No options"}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-16 flex-wrap">
        <ProviderInfo label={t.stream} providers={provider?.flatrate || []} />
        <ProviderInfo label={t.rent} providers={provider?.rent || []} />
        <ProviderInfo label={t.buy} providers={provider?.buy || []} />
      </div>
    </>
  );
};

export default ProvidersInfo;
