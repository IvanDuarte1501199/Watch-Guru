import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchGenres } from '@slice/genres/genresSlice';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';

const useGenres = () => {
    const dispatch = useAppDispatch();

    const { tvGenres, moviesGenres, isLoading, error } = useSelector(
        (state: RootState) => state.genres
    );

    useEffect(() => {
        if (moviesGenres.length === 0 && tvGenres.length === 0) {
            dispatch(fetchGenres());
        }
    }, [dispatch, moviesGenres.length, tvGenres.length]);

    return { tvGenres, moviesGenres, isLoading, error };
};

export default useGenres;
