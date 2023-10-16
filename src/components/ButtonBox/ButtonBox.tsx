import {useContext, useEffect, useState} from 'react';
import {Box} from '@mui/material';

import {LoadingContext} from '@/state/Loading/';

import {
    defaultApiServer,
    EndpointsEnum,
    apiConfigConstructor,
    ApiOptions,
    apiFetch,
    CategoriesResponse
} from '@/utils/api';

import styles from './ButtonBox.module.css';
import CategoryCard from "@/components/CategoryCard/CategoryCard.tsx";


const categoriesApiBaseOptions: ApiOptions = {
    endpointServer: defaultApiServer,
    endpointPath: EndpointsEnum.categories,
    endpointValue: '',
};

const initialCategories: CategoriesResponse = {categories: []}


export function ButtonBox() {
    const [loading, setLoading] = useContext(LoadingContext);
    const [categories, setCategories] = useState<CategoriesResponse>(initialCategories);
    const [error, setError] = useState<string | undefined>(undefined);

    let preloading: boolean = true;

    useEffect(() => {

        async function loadCategories() {
            if (!loading) {
                try {
                    preloading = true;
                    setLoading(true);
                    console.group(`🖱️ Loading categories:`);
                    const categoriesApiConfig = apiConfigConstructor(categoriesApiBaseOptions);

                    const response = await apiFetch<CategoriesResponse>(categoriesApiConfig);
                    setError('');
                    setCategories(response);
                } catch (e) {
                    if (e instanceof Error) {
                        setError(e.message);
                    }
                } finally {
                    console.groupEnd();
                    setLoading(false);
                    preloading = false;
                }
            }
        }

        loadCategories();
    }, []);


    return (
        <Box className={styles.container}>

            {error && (
                <p>
                    <span className="icon-alert inverse "></span>
                    {error}
                </p>
            )}

            {preloading && categories.categories.map(category =>
                <CategoryCard key={category.name} category={category}></CategoryCard>
            )}

        </Box>
    );
}
