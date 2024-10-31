import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCountries } from '@slice/country/countrySlice';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';

const useCountry = () => {
  const dispatch = useAppDispatch();

  const { countries, loading, error } = useSelector((state: RootState) => state.countries);

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries.length]);

  return { countries, loading, error };
};

export default useCountry;
