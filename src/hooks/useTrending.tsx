import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchTrendingAll } from '@slice/trendingSlice';

const useTrendingAll = () => {
    const dispatch = useAppDispatch();

    const {
        tvAndMoviesItems: trendingItems,
        loading,
        error,
    } = useSelector((state: RootState) => state.trendingAll);

    useEffect(() => {
        if (trendingItems.length === 0) {
            dispatch(fetchTrendingAll());
        }
    }, [dispatch, trendingItems.length]);

    return { trendingItems, loading, error };
};

export default useTrendingAll;
