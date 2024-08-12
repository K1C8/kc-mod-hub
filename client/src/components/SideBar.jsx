import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SideBar = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <div className="content-menu mx-3 bg-slate-50 rounded-xl ring-1 ring-slate-300 gap-3 w-1/4">
            <div className="m-4 ring-1 ring-slate-300 rounded-lg min-h-12">
                <p className="inline-block align-middle h-full">Searchbar placeholder</p>
            </div>
            {isAuthenticated ? (

                <div className="p-4 grid grid-flow-row-dense grid-cols-3">
                    <img src={String(user.picture)} alt="Your Avatar" className="inline-block size-24 rounded-full ring-2 ring-slate-200"></img>
                    <div className="col-span-2">
                        <p className="text-xl font-semibold">{String(user.nickname)}</p>
                        <p className="text font-light">Files you subscribed</p>
                        <p className="text font-light">Upload new files</p>
                    </div>
                </div>
            ) : (

                <div className="p-4">
                    <p>
                        Log in to view your subscription list.
                    </p>

                </div>)
            }
            <div className="p-4">
                <h2>Introduction</h2>
                <p>Click the search icon in the nav bar to activate search input, searching function not implemented though.</p>
                <p>
                </p>
            </div>
        </div>
    );
};

export default SideBar;