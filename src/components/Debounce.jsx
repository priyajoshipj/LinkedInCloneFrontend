// const debounce = (fn, delay) => {
//     let inDebounce = null;
//     return args => {
//         clearTimeout(inDebounce);
//         inDebounce = setTimeout(() => fn(args), delay);
//     }
// }

// export default debounce;
import { useState } from 'react';
import useConstant from 'use-constant';
import { useAsync } from 'react-async-hook';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

// Generic reusable hook
const useDebouncedSearch = (searchFunction) => {

    // Handle the input text state
    const [inputText, setInputText] = useState('');

    // Debounce the original search async function
    const debouncedSearchFunction = useConstant(() =>
        AwesomeDebouncePromise(searchFunction, 1000)
    );

    // The async callback is run each time the text changes,
    // but as the search function is debounced, it does not
    // fire a new request on each keystroke
    const searchResults = useAsync(
        async () => {
            if (inputText.length === 0) {
                return [];
            } else {
                return debouncedSearchFunction(inputText);
            }
        },
        [debouncedSearchFunction, inputText]
    );
    // Return everything needed for the hook consumer
    return {
        inputText,
        setInputText,
        searchResults,
    };
};

export default useDebouncedSearch;