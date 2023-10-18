import {useContext, useEffect, useState} from 'react';
import {Box} from '@mui/material';

import {LoadingContext} from '@/state/Loading/';

import { CategoriesResponse } from '@/utils/api';

import styles from './ButtonBox.module.css';
import CategoryCard from "@/components/CategoryCard/CategoryCard.tsx";
import {CurrentCategories, GenericQuery} from "@/utils/db.ts";


const initialCategories: CategoriesResponse = {categories: []}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
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

                    const dbResult = await CurrentCategories()
                    const dbResponse: CategoriesResponse = {
                        categories: dbResult
                    }
                    console.log(dbResponse.categories.length);

                    setError('');
                    // await delay(3000);
                    setCategories(dbResponse);
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
