import { useAuth0 } from '@auth0/auth0-react';
import { useState } from "react";

const SideBar = () => {
    const { user, isAuthenticated } = useAuth0();

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        fileLink: '',
        imageLink: '',
        videoLink: '',
        description: ''
    });

    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log(formData);
        toggleForm();
    };

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
                        <br />
                        <button className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm">Files you subscribed</button>
                        <br />

                        <br />
                        <button className="px-4 py-2 font-bold text-sm bg-orange-700 text-white rounded-full shadow-sm" onClick={toggleForm}>Upload new files</button>
                    </div>
                </div>
            ) : (

                <div className="p-4">
                    <p>
                        Log in to view your subscription list, items from your followed users and upload files created by you.
                    </p>

                </div>)
            }
            <div className="p-4">
                <h2>Introduction</h2>
                <p>Click the search icon in the nav bar to activate search input, searching function not implemented though.</p>
                <p>
                </p>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className='text-xl font-bold ml-2 pb-4 col-span-3'>Upload New File</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.name}
                                    onChange={handleChange}
                                    aria-labelledby="name-label"
                                />
                                <label
                                    id="name-label"
                                    htmlFor="name"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Name
                                </label>
                            </div>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="fileLink"
                                    name="fileLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.fileLink}
                                    onChange={handleChange}
                                    aria-labelledby="file-link-label"
                                />
                                <label
                                    id="file-link-label"
                                    htmlFor="fileLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    File Link
                                </label>
                            </div>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="imageLink"
                                    name="imageLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.imageLink}
                                    onChange={handleChange}
                                    aria-labelledby="image-link-label"
                                />
                                <label
                                    id="image-link-label"
                                    htmlFor="imageLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Image Link
                                </label>
                            </div>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <input
                                    type="text"
                                    id="videoLink"
                                    name="videoLink"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.videoLink}
                                    onChange={handleChange}
                                    aria-labelledby="video-link-label"
                                />
                                <label
                                    id="video-link-label"
                                    htmlFor="videoLink"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Video Link
                                </label>
                            </div>
                            <div className="relative mb-4 rounded-xl ring-1 ring-slate-300">
                                <textarea
                                    id="description"
                                    name="description"
                                    className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={formData.description}
                                    onChange={handleChange}
                                    aria-labelledby="description-label"
                                />
                                <label
                                    id="description-label"
                                    htmlFor="description"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                                >
                                    Description
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="px-4 py-2 font-bold text-sm bg-orange-800 text-white rounded-full shadow-sm"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 font-bold text-sm bg-blue-800 text-white rounded-full shadow-sm"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideBar;