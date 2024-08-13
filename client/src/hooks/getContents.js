import { useState, useEffect } from "react";

// this is a custom hook that fetches the contents items from the API
// custom hooks are a way to share logic between components
export default function useContents() {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        async function getContentsFromApi() {
            // fetch the todos from the API, passing the access token in the Authorization header
            const data = await fetch(`${process.env.REACT_APP_API_URL}/get-contents`, {
                method: "GET",
            });
            const contents = await data.json();

            setContents(contents);
        }

        getContentsFromApi();
        
    }, []);

    return [contents, setContents];
}
